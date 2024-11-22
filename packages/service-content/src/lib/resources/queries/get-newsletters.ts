import { sql } from '@blms/database';
import type { JoinedNewsletter } from '@blms/types';

export const getNewslettersQuery = (language?: string) => {
  return sql<JoinedNewsletter[]>`
    SELECT
      r.id AS resource_id,
      r.path,
      n.id AS newsletter_id,
      n.language,
      n.level,
      n.author,
      n.title,
      n.description,
      n.website_url,
      n.publication_date,
      n.tags,
      n.contributors,
      r.last_updated,
      r.last_commit
    FROM content.newsletters n
    JOIN content.resources r ON r.id = n.resource_id
    LEFT JOIN content.resource_tags rt ON rt.resource_id = r.id
    LEFT JOIN content.tags t ON t.id = rt.tag_id
    ${language ? sql`WHERE n.language = ${language}` : sql``}
    GROUP BY r.id, r.path, n.id, n.language, n.level, n.author, n.title,
      n.description, n.website_url, n.publication_date, n.tags, n.contributors;
  `;
};
