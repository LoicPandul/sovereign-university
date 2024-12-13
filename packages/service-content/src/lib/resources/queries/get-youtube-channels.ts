import { sql } from '@blms/database';
import type { JoinedYoutubeChannel } from '@blms/types';

export const getYoutubeChannelsQuery = () => {
  return sql<JoinedYoutubeChannel[]>`
    SELECT
      r.id, r.path, yc.id as uuid, yc.language, yc.name, yc.description, yc.channel, yc.trailer, r.last_updated, r.last_commit,
      ARRAY_AGG(t.name) AS tags
    FROM content.youtube_channels yc
    JOIN content.resources r ON r.id = yc.resource_id
    LEFT JOIN content.resource_tags rt ON rt.resource_id = r.id
    LEFT JOIN content.tags t ON t.id = rt.tag_id
    GROUP BY r.id, yc.id, yc.language, yc.name, yc.description, yc.channel, yc.trailer
  `;
};
