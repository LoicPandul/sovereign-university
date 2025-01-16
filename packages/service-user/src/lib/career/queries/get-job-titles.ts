import { sql } from '@blms/database';
import type { JobTitle } from '@blms/types';

export const getJobTitlesQuery = () => {
  return sql<JobTitle[]>`
        SELECT
            jt.*
        FROM users.job_titles jt
        GROUP BY jt.id;
    `;
};
