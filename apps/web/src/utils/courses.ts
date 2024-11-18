import type { CourseChapterResponse } from '@blms/types';

export function addSpaceToCourseId(courseId?: string) {
  if (!courseId) return '';

  return `${courseId.match(/\D+/)?.[0] || ''} ${
    courseId.match(/\d+/)?.[0] || ''
  }`;
}

export const goToChapterParameters = (
  chapter: CourseChapterResponse,
  type: 'previous' | 'next',
) => {
  const allChapters = chapter.course.parts.flatMap((part) => part.chapters);

  const currentChapterPosition = allChapters.findIndex(
    (chap) => chap.chapterId === chapter.chapterId,
  );

  if (type === 'previous') {
    if (currentChapterPosition < 1) {
      return { courseId: chapter.course.id };
    } else {
      const gotoChapter = allChapters[currentChapterPosition - 1];
      return {
        courseId: chapter.course.id,
        chapterId: gotoChapter.chapterId,
        chapterName: gotoChapter.title,
      };
    }
  } else {
    if (currentChapterPosition === allChapters.length - 1) {
      return { courseId: chapter.course.id };
    }
    const gotoChapter = allChapters[currentChapterPosition + 1];
    return {
      courseId: chapter.course.id,
      chapterId: gotoChapter.chapterId,
      chapterName: gotoChapter.title,
    };
  }
};

export const COURSES_WITH_INLINE_LATEX_SUPPORT = ['btc204', 'cyp201', 'cyp302'];
