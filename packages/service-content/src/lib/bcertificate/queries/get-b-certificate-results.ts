import { sql } from '@blms/database';
import type { JoinedBCertificateResults } from '@blms/types';

export const getBCertificateResultsQuery = (uid: string) => {
  return sql<JoinedBCertificateResults[]>`
    SELECT
      exam.id,
      exam.date,
      exam.location,
      exam.min_score,
      exam.duration,
      exam.path,
      exam.last_updated,
      exam.last_commit,
      t.pdf_key,
      t.img_key,
      t.txt_key,
      t.txt_ots_key,
      json_agg(json_build_object(
        'category', results.category,
        'score', results.score
      )) AS results
    FROM
      content.b_certificate_exam AS exam
    JOIN
      users.b_certificate_results AS results ON exam.id = results.b_certificate_exam
    JOIN
      users.b_certificate_timestamps AS t ON exam.id = t.b_certificate_exam
    WHERE
      results.uid = ${uid}
      AND t.uid = ${uid}
    GROUP BY
      exam.id, exam.date, exam.location, exam.min_score, exam.duration, exam.path, exam.last_updated, exam.last_commit, t.pdf_key, t.img_key, t.txt_key, t.txt_ots_key
  `;
};
