import { firstRow, rejectOnEmpty, sql } from '@blms/database';
import type { Course } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';

interface CourseAccessResponse
  extends Pick<Course, 'id' | 'paidStartDate' | 'paidEndDate'> {
  uid: string;
  allowed: string;
}

export const createCheckChapterAccess = ({ postgres }: Dependencies) => {
  return async (
    chapterId: string,
    uid: string | null,
  ): Promise<CourseAccessResponse> => {
    const course = await postgres
      .exec(
        sql<CourseAccessResponse[]>`
        SELECT
            c.id,
            c.paid_start_date,
            c.paid_end_date,
            cp.uid,
            CASE
                WHEN c.paid_end_date < NOW() THEN true
                WHEN cp.uid IS NOT NULL AND cp.payment_status = 'paid' THEN true
                ELSE false
            END AS allowed
        FROM
            content.course_chapters ch
        LEFT JOIN
            content.courses c ON c.id = ch.course_id
        LEFT JOIN
            users.course_payment cp ON c.id = cp.course_id AND cp.uid = ${uid}
        WHERE
            ch.chapter_id = ${chapterId};
      `,
      )
      .then(firstRow)
      .then(rejectOnEmpty);

    console.log('course for user', uid, course);

    return course;
  };
};
