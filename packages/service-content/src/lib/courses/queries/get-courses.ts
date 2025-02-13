import { sql } from '@blms/database';
import type { JoinedCourseWithProfessorsContributorIds } from '@blms/types';

export const getCoursesQuery = (language?: string) => {
  return sql<JoinedCourseWithProfessorsContributorIds[]>`
    SELECT
      c.id,
      c.is_archived,
      cl.language,
      c.level,
      c.hours,
      c.topic,
      c.subtopic,
      c.original_language,
      c.requires_payment,
      c.payment_expiration_date,
      c.published_at,
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
      c.is_planb_school,
      c.planb_school_markdown,
      COALESCE(NULLIF(c.sum_of_all_rating::float, 0) / NULLIF(c.number_of_rating, 0), 0) AS average_rating,
      cl.name,
      cl.goal,
      cl.objectives,
      cl.raw_description,
      c.last_updated,
      c.last_commit,
      COALESCE(cp_agg.professors, ARRAY[]::varchar[20]) as professors
    FROM content.courses c
    JOIN content.courses_localized cl ON c.id = cl.course_id

    -- Lateral join for aggregating professors
    LEFT JOIN LATERAL (
      SELECT ARRAY_AGG(cp.contributor_id) as professors
      FROM content.course_professors cp
      WHERE cp.course_id = c.id
    ) AS cp_agg ON TRUE

    ${language ? sql`WHERE cl.language = LOWER(${language})` : sql``}

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
      c.is_planb_school,
      c.planb_school_markdown,
      cl.name,
      cl.goal,
      cl.objectives,
      cl.raw_description,
      c.last_updated,
      c.last_commit,
      cp_agg.professors
  `;
};

export const getProfessorCoursesQuery = (
  courseIds: string[],
  language?: string,
) => {
  return sql<JoinedCourseWithProfessorsContributorIds[]>`
    SELECT
      c.id,
      c.is_archived,
      cl.language,
      c.level,
      c.hours,
      c.topic,
      c.subtopic,
      c.original_language,
      c.requires_payment,
      c.payment_expiration_date,
      c.published_at,
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
      c.is_planb_school,
      c.planb_school_markdown,
      COALESCE(NULLIF(c.sum_of_all_rating::float, 0) / NULLIF(c.number_of_rating, 0), 0) AS average_rating,
      cl.name,
      cl.goal,
      cl.objectives,
      cl.raw_description,
      c.last_updated,
      c.last_commit,
      COALESCE(cp_agg.professors, ARRAY[]::varchar[20]) as professors
    FROM content.courses c
    JOIN content.courses_localized cl ON c.id = cl.course_id

    -- Lateral join for aggregating professors
    LEFT JOIN LATERAL (
      SELECT ARRAY_AGG(cp.contributor_id) as professors
      FROM content.course_professors cp
      WHERE cp.course_id = c.id
    ) AS cp_agg ON TRUE

    WHERE c.id = ANY(${courseIds})
    ${language ? sql`AND cl.language = LOWER(${language})` : sql``}

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
      c.is_planb_school,
      c.planb_school_markdown,
      cl.name,
      cl.goal,
      cl.objectives,
      cl.raw_description,
      c.last_updated,
      c.last_commit,
      cp_agg.professors
  `;
};
