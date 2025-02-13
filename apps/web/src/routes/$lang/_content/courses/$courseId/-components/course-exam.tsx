import { useState } from 'react';

import type { CourseChapterResponse, PartialExamQuestion } from '@blms/types';

import { trpc } from '#src/utils/trpc.ts';

import { ExamNotTranslated } from './exam-not-translated.tsx';
import { ExamPresentation } from './exam-presentation.tsx';
import { ExamResults } from './exam-results.tsx';
import { FinalExam } from './final-exam.tsx';

interface CourseExamProps {
  chapter: CourseChapterResponse;
  disabled?: boolean;
}

export const CourseExam = ({ chapter, disabled }: CourseExamProps) => {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);

  const [partialExamQuestions, setPartialExamQuestions] = useState<
    PartialExamQuestion[]
  >([]);

  const { data: previousExamResults, isFetched: isPreviousExamResultsFetched } =
    trpc.user.courses.getLatestExamResults.useQuery(
      {
        courseId: chapter.courseId,
      },
      {
        enabled: !disabled,
      },
    );

  const noPreviousExamAttempt =
    !isExamStarted && isPreviousExamResultsFetched && !previousExamResults;

  const shouldRenderExamPresentation = disabled;

  return (
    <>
      {(noPreviousExamAttempt || shouldRenderExamPresentation) && (
        <ExamPresentation
          disabled={disabled}
          chapter={chapter}
          setIsExamStarted={setIsExamStarted}
          setPartialExamQuestions={setPartialExamQuestions}
        />
      )}

      {isExamStarted && !isExamCompleted && partialExamQuestions.length > 0 && (
        <FinalExam
          questions={partialExamQuestions}
          setIsExamCompleted={setIsExamCompleted}
          chapter={chapter}
        />
      )}

      {isExamStarted &&
        !isExamCompleted &&
        partialExamQuestions.length === 0 && (
          <ExamNotTranslated chapter={chapter} />
        )}

      {((!isExamCompleted && !isExamStarted && previousExamResults) ||
        isExamCompleted) && (
        <ExamResults
          chapter={chapter}
          setIsExamStarted={setIsExamStarted}
          setPartialExamQuestions={setPartialExamQuestions}
        />
      )}
    </>
  );
};
