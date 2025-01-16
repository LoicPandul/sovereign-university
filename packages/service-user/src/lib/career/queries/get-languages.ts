import { sql } from '@blms/database';
import type { Language } from '@blms/types';

export const getLanguagesQuery = () => {
  return sql<Language[]>`
        SELECT
            l.*
        FROM users.languages l
        GROUP BY l.code;
    `;
};
