import { firstRow } from '@blms/database';
import type { Resource } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { separateContentFiles, yamlToObject } from '../../../utils.js';
import type { ChangedResource } from '../index.js';
import { createProcessMainFile } from '../main.js';

interface YoutubeChannelMain {
  id: string;
  name: string;
  language: string;
  description?: string;
  links?: {
    channel?: string;
    trailer?: string;
  };
}

export const createProcessChangedYoutubeChannel = (
  { postgres }: Dependencies,
  errors: string[],
) => {
  return async (resource: ChangedResource) => {
    return postgres
      .begin(async (transaction) => {
        const { main } = separateContentFiles(resource, 'channel.yml');
        if (!main) return;

        try {
          const processMainFile = createProcessMainFile(transaction);
          await processMainFile(resource, main);
        } catch (error) {
          errors.push(
            `Error processing file(youtube channels) ${resource?.path} (${resource.fullPath}): ${error}`,
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
          const parsed = await yamlToObject<YoutubeChannelMain>(main);

          await transaction`
              INSERT INTO content.youtube_channels (
                resource_id, id, language, name, description, channel, trailer
              )
              VALUES (
                ${resourceId}, ${parsed.id}, ${parsed.language}, ${parsed.name}, ${parsed.description?.trim()}, ${parsed.links?.channel}, ${parsed.links?.trailer}
              )
              ON CONFLICT (resource_id) DO UPDATE SET
                language = EXCLUDED.language,
                name = EXCLUDED.name,
                description = EXCLUDED.description,
                channel = EXCLUDED.channel,
                trailer = EXCLUDED.trailer;
            `;
        } catch (error) {
          errors.push(
            `Error processing file(youtube channel) ${main?.path} (${resource.fullPath}): ${error}`,
          );
        }
      })
      .catch(() => {
        return;
      });
  };
};
