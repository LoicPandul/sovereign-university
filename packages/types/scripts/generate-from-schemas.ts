import fs from 'node:fs';
import path from 'node:path';

import ts from 'typescript';
import type { ZodEnumDef, ZodTypeAny } from 'zod';
import { type GetType, printNode, zodToTs } from 'zod-to-ts';

import * as schemas from '@blms/schemas';

const schemasDirectory = '../schemas/src';
const outputDirectory = './src/generated';
const ignorePaths = new Set<string>([]);
const ignoreFiles = new Set<string>([]);

const generatedHeader =
  '// @generated\n// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.\n\n';

// Delete the output directory if it exists
if (fs.existsSync(outputDirectory)) {
  fs.rmSync(outputDirectory, { recursive: true, force: true });
}

// Ensure the output directory is created
fs.mkdirSync(outputDirectory, { recursive: true });

// Process a regular file: extract schemas based on our export patterns
// (basically any time of exports of a variable ending with 'Schema')
// and generate a new file in types with type definitions
const processFile = (filePath: string, relativePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const exportedSchemas = extractSchemas(fileContent);
  const newFileContent = generateFileContent(exportedSchemas, relativePath);

  // Write the result in `packages/types` while maintaining folder structure
  const outputFilePath = path.join(outputDirectory, relativePath);
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFileSync(outputFilePath, newFileContent);
};

// Recursive function to traverse directory structure
const processDirectory = (directory: string, relativePath = '') => {
  for (const file of fs.readdirSync(directory).reverse()) {
    const fullPath = path.join(directory, file);
    const relPath = path.join(relativePath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!ignorePaths.has(file)) {
        processDirectory(fullPath, relPath);
      }
    } else if (file === 'index.ts') {
      processIndexFile(fullPath, relPath);
    } else if (
      path.extname(file) === '.ts' &&
      !file.endsWith('.test.ts') &&
      !ignoreFiles.has(file)
    ) {
      processFile(fullPath, relPath);
    }
  }
};

// We process index files differently because we want to keep the wildcard exports
const processIndexFile = (sourcePath: string, relativePath: string) => {
  const fileContent = fs.readFileSync(sourcePath, 'utf8');

  const isValidIndexFile = (fileContent: string): boolean => {
    // Check if the file only contains export statements, empty lines or the zod import zod
    const lines = fileContent.split('\n');
    return lines.every(
      (line) =>
        line.match(/^export/) ||
        line.match(/^\/\//) ||
        line.trim() === '' ||
        line.trim() === "import 'zod';",
    );
  };

  if (isValidIndexFile(fileContent)) {
    // Use type exports instead of regular exports so our package keeps being type-only
    const modifiedContent =
      generatedHeader +
      fileContent
        .replace(/export \*/g, 'export type *')
        .replace(
          /export type \* from 'drizzle-orm\/pg-core';/g,
          "//export type * from 'drizzle-orm/pg-core';",
        );
    const destinationPath = path.join(outputDirectory, relativePath);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.writeFileSync(destinationPath, modifiedContent);
  } else {
    console.warn(
      `Skipping index file ${sourcePath} because it does not only contain export statements`,
    );
  }
};

const extractSchemas = (fileContent: string): string[] => {
  const schemaNames = new Set<string>();
  const regexPatterns = [
    /export\s+const\s+(\w+Schema)\s*=/g, // For direct exports
    /export\s+{\s*(\w+Schema)\s*}/g, // For named exports
    /export\s+{\s*\w+\s+as\s+(\w+Schema)\s*}/g, // For renamed exports
  ];

  for (const pattern of regexPatterns) {
    let match;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((match = pattern.exec(fileContent)) !== null) {
      // @ts-ignore - we know this is not null
      schemaNames.add(match[1]);
    }
  }

  return [...schemaNames];
};

// Map of enum values to their corresponding type name and import path
const enumsMap = new Map<string, string>();

let currentlyProcessedType = '';
let currentlyProcessedFile = '';
let currentImportSet: Set<string>;

const generateFileContent = (
  schemaNames: string[],
  filePath: string, // Current file path (used to track imports)
): string => {
  let fileContent = '';
  currentlyProcessedFile = filePath;
  currentImportSet = new Set();

  for (const name of schemaNames) {
    const schema = (schemas as any)[name] as ZodTypeAny & GetType;

    const typeName = typeNameFromSchema(name);
    currentlyProcessedType = typeName;

    console.debug(`Processing schema "${typeName}"`);

    const zodType = schema._def?.typeName;

    // Register enum
    if (zodType === 'ZodEnum') {
      const values = (schema._def as ZodEnumDef).values;
      enumsMap.set(values.map((v) => `"${v}"`).join(' | '), typeName);
    }

    const { node } = zodToTs(schema);

    // Append a custom getType function to the schema once it have been processed
    schema._def.getType = (ts) => {
      // Do not return self-references (otherwise you end up with export A = A)
      if (currentlyProcessedType === typeName) {
        console.debug(`Skipping self-reference for type "${typeName}"`);
        return null;
      }

      console.debug(`Get type "${currentlyProcessedType}" -> "${typeName}"`);

      if (filePath !== currentlyProcessedFile) {
        console.debug(
          `Type "${typeName}" not found in ${currentlyProcessedFile} and will be imported from ${filePath}`,
        );

        // TODO: This is a bit hacky, but it works for now
        const importName = `${/.*\/(.+)\.ts$/.exec(filePath)?.[1]}.js`;
        currentImportSet.add(
          `import { ${typeName} } from './${importName}';\n`,
        );
      }

      return ts.factory.createIdentifier(typeName);
    };

    let output = printNode(node);

    // Look for enum values in the output and replace them with the corresponding type name
    // Tip: search ('.+' \| )+'.+' to find all enum values left in the output
    if (zodType !== 'ZodEnum') {
      for (const [values, type] of enumsMap) {
        if (output.includes(values)) {
          console.debug('Replacing', values, 'with', type);
          output = output.replace(values, type);
        }
      }
    }

    switch (node.kind) {
      // @ts-ignore TODO align ts version between zod-to-ts and workspace
      case ts.SyntaxKind.TypeLiteral:
        fileContent += `export interface ${typeName} ${output};\n\n`;
        break;
      default:
        fileContent += `export type ${typeName} = ${output};\n\n`;
    }
  }

  return generatedHeader + Array.from(currentImportSet).join('') + fileContent;
};

// Convert a schema name to a type name (capitalized and without the 'Schema' suffix)
const typeNameFromSchema = (schemaName: string): string => {
  const nameWithoutSchema = schemaName.replace(/Schema$/, '');
  return nameWithoutSchema.charAt(0).toUpperCase() + nameWithoutSchema.slice(1);
};

processDirectory(schemasDirectory);
processDirectory(schemasDirectory); // Do it twice to handle imports correctly
