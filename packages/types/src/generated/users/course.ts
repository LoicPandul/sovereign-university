// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

export interface CourseProgress {
  uid: string;
  courseId: string;
  completedChaptersCount: number;
  lastUpdated: Date;
  progressPercentage: number;
}

export interface CoursePayment {
  uid: string;
  courseId: string;
  paymentStatus: string;
  amount: number;
  paymentId: string;
  invoiceUrl: string | null;
  couponCode: string | null;
  lastUpdated: Date;
}

export interface CourseUserChapter {
  uid: string;
  courseId: string;
  chapterId: string;
  completedAt: Date;
  booked: boolean | null;
}

export interface CourseQuizAttempts {
  uid: string;
  chapterId: string;
  questionsCount: number;
  correctAnswersCount: number;
  doneAt: Date;
}

export interface CourseProgressExtended {
  uid: string;
  courseId: string;
  completedChaptersCount: number;
  lastUpdated: Date;
  progressPercentage: number;
  totalChapters: number;
  chapters: {
    chapterId: string;
    completedAt: Date;
  }[];
  nextChapter?:
    | {
        chapterIndex: number;
        chapterId: string;
        courseId: string;
      }
    | undefined;
  lastCompletedChapter?:
    | {
        chapterId: string;
        completedAt: Date;
      }
    | undefined;
}
