import { sql } from '@blms/database';
import type { JoinedCareerProfile } from '@blms/types';

export const deleteCareerProfileQuery = (uid: string) => {
  return sql<JoinedCareerProfile[]>`
        DELETE FROM users.career_profiles
        WHERE uid = ${uid}
        RETURNING *
        ;
    `;
};
