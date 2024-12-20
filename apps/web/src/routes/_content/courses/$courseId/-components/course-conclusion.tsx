import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { CourseChapterResponse } from '@blms/types';
import { Button, cn } from '@blms/ui';

import BookPixel from '#src/assets/icons/book-pixelated.svg?react';
import bookOpen from '#src/assets/icons/book_open.svg';
import FailurePixel from '#src/assets/icons/failure-pixelated.svg?react';
import HeartPixel from '#src/assets/icons/heart-pixelated.svg?react';
import SpeechIcon from '#src/assets/icons/speech_icon.svg?react';
import SuccessParty from '#src/assets/icons/success_party.svg?react';
import ThumpUp from '#src/assets/icons/thumb-up-pixelated.svg?react';
import { CourseCurriculum } from '#src/organisms/course-curriculum.tsx';
import { trpc } from '#src/utils/trpc.ts';

import { ConclusionFinish } from './course-conclusion/conclusion-finish.tsx';
import { ExamFailed } from './course-conclusion/exam-failed.tsx';
import { ExamNotPassed } from './course-conclusion/exam-not-passed.tsx';
import { ExamSucceeded } from './course-conclusion/exam-succeeded.tsx';
import { CourseReview } from './course-review.tsx';

interface CourseConclusionProps {
  chapter: CourseChapterResponse;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export const CourseConclusion = ({ chapter }: CourseConclusionProps) => {
  const { i18n } = useTranslation();

  const [step, setStep] = useState(0);

  const { data: course } = trpc.content.getCourse.useQuery({
    id: chapter.courseId,
    language: i18n.language,
  });

  const { data: courseProgress, refetch: refetchCourseProgress } =
    trpc.user.courses.getProgress.useQuery(
      {
        courseId: course ? course.id : '',
      },
      {
        enabled: course !== undefined,
      },
    );

  const { data: courseChapters } = trpc.content.getCourseChapters.useQuery({
    id: chapter.courseId,
    language: i18n.language,
  });

  const examChapterId = courseChapters?.find((c) => c.isCourseExam)?.chapterId;

  const completeAllChaptersMutation =
    trpc.user.courses.completeAllChapters.useMutation({
      onSuccess: () => {
        refetchCourseProgress();
        scrollToTop();
      },
    });

  const { data: courseReview } = trpc.user.courses.getCourseReview.useQuery(
    {
      courseId: course?.id || '',
    },
    {
      enabled: step >= 1,
    },
  );

  const { data: previousExamResults } =
    trpc.user.courses.getLatestExamResults.useQuery(
      {
        courseId: chapter.courseId,
      },
      {
        enabled: step >= 2,
      },
    );

  const completeChapterMutation =
    trpc.user.courses.completeChapter.useMutation();

  const completedChapters = courseProgress?.[0]?.chapters;

  // const allClassicChaptersDone = false;
  // const everythingDone =
  //   allClassicChaptersDone && courseReview && previousExamResults?.succeeded;

  function updateStep(step: number) {
    scrollToTop();
    setStep(step);
  }

  useEffect(() => {
    if (course && courseProgress) {
      const completedChaptersIds = [
        completedChapters?.map((c) => c.chapterId),
      ].flat();

      const unfinishedClassicChapters = course?.parts
        .flatMap((p) => p.chapters)
        .filter(
          (c) =>
            c &&
            completedChaptersIds &&
            !c?.isCourseConclusion &&
            !c?.isCourseExam &&
            !c?.isCourseReview &&
            !completedChaptersIds?.includes(c.chapterId),
        );

      const allClassicChaptersDone =
        (unfinishedClassicChapters && unfinishedClassicChapters.length === 0) ||
        false;

      if (allClassicChaptersDone) {
        setTimeout(() => updateStep(1), 3000);
      }
    }
  }, [completedChapters, course, courseProgress]);

  useEffect(() => {
    if (courseReview && step === 1) {
      setTimeout(() => updateStep(2), 3000);
    }
  }, [courseReview, step]);

  useEffect(() => {
    if (previousExamResults && step === 2) {
      setTimeout(() => updateStep(3), 3000);
    }
  }, [previousExamResults, step]);

  useEffect(() => {
    if (previousExamResults?.succeeded && step === 3) {
      setTimeout(() => updateStep(4), 3000);
    }
  }, [previousExamResults, step]);

  interface HeaderBoxProps {
    children: string | JSX.Element;
    isDone: boolean;
  }

  const HeaderBox = ({ children, isDone }: HeaderBoxProps) => {
    return (
      <div
        className={cn(
          'size-14 md:size-24 border-4 rounded-xl flex flex-col items-center justify-center',
          isDone
            ? 'border-darkOrange-1 bg-darkOrange-5'
            : 'border-darkOrange-5',
        )}
      >
        {children}
      </div>
    );
  };

  const lineSizeClass = 'w-6 sm:w-14 md:w-28 lg:w-52 h-2 ';
  const linkMainClass = lineSizeClass + ' bg-newGray-5';
  const linkSubClass =
    lineSizeClass +
    'absolute bg-gradient-to-r from-white to-darkOrange-5 transition-all duration-3000 ease-in-out start-animation';
  const iconSizeClass = 'size-7 md:size-14';

  return (
    <>
      <span>TEST: {step}</span>
      <div className="flex flex-row pb-12 items-center">
        <HeaderBox isDone={step >= 1}>
          {step <= 0 ? (
            <img className={cn(iconSizeClass)} src={bookOpen} alt="" />
          ) : (
            <ThumpUp className={cn(iconSizeClass, 'fill-white')} />
          )}
        </HeaderBox>
        <div className={linkMainClass}>
          {step >= 1 ? <div className={linkSubClass}></div> : null}
        </div>

        <HeaderBox isDone={step >= 2}>
          {step <= 1 ? (
            <SpeechIcon className={cn(iconSizeClass, 'fill-newOrange-1')} />
          ) : (
            <HeartPixel className={cn(iconSizeClass, 'fill-white')} />
          )}
        </HeaderBox>
        <div className={linkMainClass}>
          {step >= 2 ? <div className={linkSubClass}></div> : null}
        </div>

        <HeaderBox isDone={step >= 3}>
          {step <= 2 ? (
            <BookPixel className={cn(iconSizeClass, 'fill-newOrange-1')} />
          ) : (
            <>
              {previousExamResults && previousExamResults.succeeded ? (
                <SuccessParty className={cn(iconSizeClass, 'fill-white')} />
              ) : (
                <FailurePixel className={cn(iconSizeClass, 'fill-white')} />
              )}
            </>
          )}
        </HeaderBox>
        <div className={linkMainClass}>
          {step >= 3 ? <div className={linkSubClass}></div> : null}
        </div>

        <Button
          variant={step >= 4 ? 'primary' : 'outline'}
          onClick={() => {
            if (step === 4) {
              completeChapterMutation.mutate({
                courseId: chapter.course.id,
                chapterId: chapter.chapterId,
                language: chapter.language,
              });
              updateStep(5);
            }
          }}
        >
          {t('words.finish')}
        </Button>
      </div>

      <div className="bg-gray-100 p-6 rounded-2xl shadow-md">
        {course && step === 0 ? (
          <>
            <p className="uppercase text-newGray-1">{t('words.chapters')}</p>
            <p className="mt-6">{t('dashboard.course.conclusionHeadline')}</p>
            <CourseCurriculum
              course={course}
              completedChapters={completedChapters?.map(
                (chapter) => chapter.chapterId,
              )}
              nextChapter={courseProgress?.[0]?.nextChapter?.chapterId}
              hideGithubLink
              displayNotStarted
              expandAll
              className="self-start w-full mt-5 md:mt-10"
            ></CourseCurriculum>
            {step > 1 ? null : (
              // TODO CHECK IF TRANSITIONING
              <Button
                className="ml-auto mr-6"
                onClick={() => {
                  completeAllChaptersMutation.mutate({
                    courseId: chapter.course.id,
                    language: chapter.language,
                  });
                }}
              >
                {t('dashboard.myCourses.completeAll')}
              </Button>
            )}
          </>
        ) : null}

        {step === 1 ? (
          <>
            <p className="uppercase text-newGray-1">
              {t('courses.review.feedback')}
            </p>
            {courseReview ? (
              <>
                <div className="flex flex-col mx-auto items-center">
                  <HeartPixel className="size-12 fill-newOrange-1" />
                  <div className="mt-4">
                    {t('courses.review.conclusionFeedback1')}
                  </div>
                  <div>{t('courses.review.conclusionFeedback2')}</div>
                  <div className="mt-4 text-sm">
                    {t('courses.review.conclusionFeedback3')}
                  </div>
                </div>
                <div>
                  <CourseReview
                    courseId={course?.id}
                    existingReview={courseReview}
                    isConclusionReview
                  />
                </div>
              </>
            ) : (
              <div className="mt-6">
                <CourseReview courseId={course?.id} isConclusionReview />
              </div>
            )}
          </>
        ) : null}

        {step >= 2 && step <= 4 ? (
          <>
            <p className="uppercase text-newGray-1">
              {t('courses.exam.finalExam')}
            </p>
            {previousExamResults &&
            previousExamResults.finalized &&
            previousExamResults.score !== null ? (
              <>
                {previousExamResults.succeeded ? (
                  <ExamSucceeded score={previousExamResults.score} />
                ) : (
                  <ExamFailed
                    score={previousExamResults.score}
                    courseId={course?.id}
                    chapterId={examChapterId}
                  />
                )}
              </>
            ) : (
              <ExamNotPassed courseId={course?.id} chapterId={examChapterId} />
            )}
          </>
        ) : null}

        {step === 5 && course ? <ConclusionFinish course={course} /> : null}
      </div>
    </>
  );
};
