import type { CourseProgress } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import {
  calculateProgressQuery,
  completeAllChaptersQuery,
  completeChapterQuery,
} from '../queries/complete-chapter.js';

interface Options {
  uid: string;
  courseId: string;
  chapterId: string;
  language: string;
}

export const createCompleteChapter = ({ postgres }: Dependencies) => {
  return async ({
    uid,
    courseId,
    chapterId,
    language,
  }: Options): Promise<CourseProgress[]> => {
    await postgres.exec(completeChapterQuery(uid, courseId, chapterId));

    return postgres.exec(calculateProgressQuery(uid, courseId, language));
  };
};

interface Options2 {
  uid: string;
  courseId: string;
  language: string;
}

export const createCompleteAllChapters = ({ postgres }: Dependencies) => {
  return async ({
    uid,
    courseId,
    language,
  }: Options2): Promise<CourseProgress[]> => {
    await postgres.exec(completeAllChaptersQuery(uid, courseId, language));

    return postgres.exec(calculateProgressQuery(uid, courseId, language));
  };
};
