import type { CourseProgress } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { completeChapterQuery } from '../queries/complete-chapter.js';

interface Options {
  uid: string;
  courseId: string;
  chapterId: string;
  language: string;
}

export const createCompleteChapter = ({ postgres }: Dependencies) => {
  return ({
    uid,
    courseId,
    chapterId,
    language,
  }: Options): Promise<CourseProgress[]> => {
    return postgres.exec(
      completeChapterQuery(uid, courseId, chapterId, language),
    );
  };
};
