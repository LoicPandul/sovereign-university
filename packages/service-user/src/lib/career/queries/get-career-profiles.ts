import { sql } from '@blms/database';
import type { JoinedCareerProfile } from '@blms/types';

export const getCareerProfilesQuery = () => {
  return sql<JoinedCareerProfile[]>`
    SELECT
        cp.*,
        COALESCE(json_agg(DISTINCT jsonb_build_object('language_code', cl.language_code, 'level', cl.level)) FILTER (WHERE cl.language_code IS NOT NULL), '[]') AS languages,
        COALESCE(json_agg(DISTINCT jsonb_build_object('role_id', cr.role_id, 'level', cr.level)) FILTER (WHERE cr.role_id IS NOT NULL), '[]') AS roles,
        COALESCE(json_agg(DISTINCT ccs.size) FILTER (WHERE ccs.size IS NOT NULL), '[]') AS company_sizes
    FROM users.career_profiles cp
    LEFT JOIN users.career_languages cl ON cp.id = cl.career_profile_id
    LEFT JOIN users.career_roles cr ON cp.id = cr.career_profile_id
    LEFT JOIN users.career_company_sizes ccs ON cp.id = ccs.career_profile_id
    WHERE cp.are_terms_accepted = true AND cp.allow_receiving_emails = true
    GROUP BY cp.id;
    `;
};
