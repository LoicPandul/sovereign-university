import { sql } from '@blms/database';
import type { JoinedBuilder } from '@blms/types';

type BuilderMeta = Pick<
  JoinedBuilder,
  'id' | 'path' | 'name' | 'language' | 'description' | 'lastCommit'
>;

export const getProjectMetaQuery = (id: number, language?: string) => {
  return sql<BuilderMeta[]>`
    SELECT
      r.id,
      r.path,
      b.name,
      bl.language,
      bl.description,
      r.last_commit
    FROM content.builders b
    JOIN content.resources r ON r.id = b.resource_id
    JOIN content.builders_localized bl ON bl.id = b.id
    WHERE r.id = ${id}
    ${language ? sql`AND bl.language = LOWER(${language})` : sql``}
  `;
};
