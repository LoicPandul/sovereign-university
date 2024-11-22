import { firstRow } from '@blms/database';
import type { Resource } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { separateContentFiles, yamlToObject } from '../../../utils.js';
import type { ChangedResource } from '../index.js';
import { createProcessMainFile } from '../main.js';

interface NewsletterMain {
  id: string;
  level: string;
  author: string;
  title: string;
  link?: Array<{ website?: string }>;
  publication_date: string;
  tags?: string[];
  contributors?: string[];
  language?: string;
  description?: string;
}

export const createProcessChangedNewsletter = (
  { postgres }: Dependencies,
  errors: string[],
) => {
  return async (resource: ChangedResource) => {
    return postgres
      .begin(async (transaction) => {
        const { main } = separateContentFiles(resource, 'newsletter.yml');
        if (!main) return;

        try {
          const processMainFile = createProcessMainFile(transaction);
          await processMainFile(resource, main);
        } catch (error) {
          errors.push(
            `Error processing file(newsletters) ${resource?.path} (${resource.fullPath}): ${error}`,
          );
          return;
        }

        const resourceId = await transaction<Resource[]>`
          SELECT id FROM content.resources WHERE path = ${resource.path}
        `
          .then(firstRow)
          .then((row) => row?.id);

        if (!resourceId) {
          throw new Error(`Resource not found for path ${resource.path}`);
        }

        try {
          const parsed = await yamlToObject<NewsletterMain>(main);
          const websiteUrl = parsed.link?.[0]?.website;

          await transaction`
            INSERT INTO content.newsletters (
              resource_id, id, author, level, website_url, publication_date, title, description, tags, contributors, language
            )
            VALUES (
              ${resourceId},
              ${parsed.id},
              ${parsed.author},
              ${parsed.level},
              ${websiteUrl},
              ${parsed.publication_date},
              ${parsed.title || ''},
              ${parsed.description || ''},
              ${parsed.tags || []},
              ${parsed.contributors || []},
              ${parsed.language || 'en'}
            )
            ON CONFLICT (resource_id) DO UPDATE SET
              author = EXCLUDED.author,
              level = EXCLUDED.level,
              website_url = EXCLUDED.website_url,
              publication_date = EXCLUDED.publication_date,
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              tags = EXCLUDED.tags,
              contributors = EXCLUDED.contributors,
              language = EXCLUDED.language;
          `;
        } catch (error) {
          errors.push(
            `Error processing main file ${main?.path} (${resource.fullPath}): ${error}`,
          );
        }
      })
      .catch(() => {
        return;
      });
  };
};
