import { sql } from '@blms/database';
import type { JoinedCourseWithProfessorsContributorIds } from '@blms/types';

export const getProfessorCoursesQuery = ({
  id,
  contributorId,
  language,
}: {
  language?: string;
} & (
  | {
      id?: undefined;
      contributorId: string;
    }
  | {
      id: number;
      contributorId?: undefined;
    }
)) => {
  const whereClauses = [];

  if (id !== undefined) {
    whereClauses.push(sql`p.id = ${id}`);
  }
  if (contributorId !== undefined) {
    whereClauses.push(sql`p.contributor_id = ${contributorId}`);
  }
  if (language !== undefined) {
    whereClauses.push(sql`cl.language = LOWER(${language})`);
  }
  const whereStatement = sql`WHERE ${whereClauses.reduce(
    (acc, clause) => sql`${acc} AND ${clause}`,
  )}`;

  return sql<JoinedCourseWithProfessorsContributorIds[]>`
    SELECT
      c.id,
      cl.language,
      c.level,
      c.hours,
      c.topic,
      c.subtopic,
      c.original_language,
      c.requires_payment,
      c.format,
      c.online_price_dollars,
      c.inperson_price_dollars,
      c.paid_description,
      c.paid_video_link,
      c.start_date,
      c.end_date,
      c.contact,
      c.available_seats,
      c.remaining_seats,
      c.number_of_rating,
      c.sum_of_all_rating,
      COALESCE(NULLIF(c.sum_of_all_rating, 0) / NULLIF(c.number_of_rating, 0), 0) AS average_rating,
      cl.name,
      cl.goal,
      cl.objectives,
      cl.raw_description,
      c.last_updated,
      c.last_commit,
      COALESCE(cp_agg.professors, ARRAY[]::varchar[20]) as professors
    FROM content.professors p

    -- Join to get the course_professors
    JOIN content.course_professors cp ON p.contributor_id = cp.contributor_id

    -- Join to get the actual course details
    JOIN content.courses c ON cp.course_id = c.id

    -- Join to get the localized course details
    JOIN content.courses_localized cl ON c.id = cl.course_id

    -- Lateral join for aggregating professors
    LEFT JOIN LATERAL (
      SELECT ARRAY_AGG(cp.contributor_id) as professors
      FROM content.course_professors cp
      WHERE cp.course_id = c.id
    ) AS cp_agg ON TRUE

    ${whereStatement}

    GROUP BY
      c.id,
      cl.language,
      c.level,
      c.hours,
      c.topic,
      c.subtopic,
      c.original_language,
      c.requires_payment,
      c.format,
      c.online_price_dollars,
      c.inperson_price_dollars,
      c.paid_description,
      c.paid_video_link,
      c.start_date,
      c.end_date,
      c.contact,
      c.available_seats,
      c.remaining_seats,
      c.number_of_rating,
      c.sum_of_all_rating,
      cl.name,
      cl.goal,
      cl.objectives,
      cl.raw_description,
      c.last_updated,
      c.last_commit,
      cp_agg.professors
  `;
};
