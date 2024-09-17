import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  usersCoursePayment,
  usersCourseProgress,
  usersCourseReview,
  usersCourseUserChapter,
  usersQuizAttempts,
} from '@blms/database';

import { courseChapterSchema } from '../content/index.js';

export const courseProgressSchema = createSelectSchema(usersCourseProgress);
export const coursePaymentSchema = createSelectSchema(usersCoursePayment);
export const courseUserChapterSchema = createSelectSchema(
  usersCourseUserChapter,
);
export const courseQuizAttemptsSchema = createSelectSchema(usersQuizAttempts);
export const courseReviewSchema = createSelectSchema(usersCourseReview);

export const courseProgressExtendedSchema = courseProgressSchema.merge(
  z.object({
    totalChapters: z.number(),
    chapters: z.array(
      courseUserChapterSchema.pick({
        chapterId: true,
        completedAt: true,
      }),
    ),
    nextChapter: courseChapterSchema
      .pick({
        chapterIndex: true,
        chapterId: true,
        courseId: true,
      })
      .optional(),
    lastCompletedChapter: courseUserChapterSchema
      .pick({
        chapterId: true,
        completedAt: true,
      })
      .optional(),
  }),
);

export const getUserChapterResponseSchema = courseUserChapterSchema.pick({
  courseId: true,
  chapterId: true,
  completedAt: true,
  booked: true,
});
