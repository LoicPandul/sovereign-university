import { sql } from '@blms/database';
import type { JoinedNewsletter } from '@blms/types';

export const getNewsletterQuery = (id: number) => {
  return sql<JoinedNewsletter[]>`
    SELECT
      r.id as resource_id, r.path, n.language, n.level, n.title, n.author, n.description,
      n.website_url, n.publication_date, n.contributors, r.last_updated,
      r.last_commit, ARRAY_AGG(t.name) AS tags
    FROM content.newsletters n
    JOIN content.resources r ON r.id = n.resource_id
    LEFT JOIN content.resource_tags rt ON rt.resource_id = r.id
    LEFT JOIN content.tags t ON t.id = rt.tag_id
    WHERE r.id = ${id}
    GROUP BY r.id, n.language, n.level, n.title, n.author, n.description,
      n.website_url, n.publication_date, n.contributors, r.last_updated, r.last_commit
  `;
};
