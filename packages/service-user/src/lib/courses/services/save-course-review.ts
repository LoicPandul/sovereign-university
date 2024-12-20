import type { CourseReview } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { completeChapterQuery } from '../queries/complete-chapter.js';
import { saveCourseReview } from '../queries/save-course-review.js';

interface Options {
  newReview: CourseReview;
  chapterId: string;
}

export const createSaveCourseReview = ({ postgres }: Dependencies) => {
  return async (options: Options): Promise<void> => {
    const res = postgres
      .exec(saveCourseReview(options.newReview))
      .then(() => void 0);

    await postgres.exec(
      completeChapterQuery(
        options.newReview.uid,
        options.newReview.courseId,
        options.chapterId,
      ),
    );

    return res;
  };
};
