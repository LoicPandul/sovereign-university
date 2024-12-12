import { sql } from '@blms/database';
import type { CourseProgress } from '@blms/types';

export const saveCourseProgress = ({
  uid,
  courseId,
}: {
  uid: string;
  courseId: string;
}) => {
  return sql<CourseProgress[]>`
    INSERT INTO users.course_progress (uid, course_id)
    VALUES (${uid}, ${courseId})
    ON CONFLICT (uid, course_id) DO UPDATE SET
      last_updated = NOW()
    RETURNING *;
  `;
};
