import { sql } from '@blms/database';
import type { JoinedCareerProfile } from '@blms/types';

export const insertCareerProfileQuery = (uid: string) => {
  return sql<JoinedCareerProfile[]>`
        INSERT INTO users.career_profiles (
            uid, id, first_name, last_name, country, email, linkedin, github, telegram, other_contact,
            is_bitcoin_community_participant, bitcoin_community_text, is_bitcoin_project_participant, bitcoin_project_text,
            is_available_full_time, remote_work_preference, expected_salary, availability_start, cv_url, motivation_letter,
            are_terms_accepted, allow_receiving_emails, created_at, edited_at
        )
        VALUES (
            ${uid}, uuid_generate_v4(), '', '', '', '', '', '', '', '', false, '', false, '', true, 'yes', '', '', '', '', false, false,
            NOW(), NOW()
        )
        ON CONFLICT (uid) DO NOTHING
        RETURNING *
        ;
    `;
};
