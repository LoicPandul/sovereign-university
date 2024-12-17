import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

import type { CourseChapterResponse } from '@blms/types';
import { Button } from '@blms/ui';

import heartOrange from '#src/assets/icons/heart_orange.svg';
import { CourseCurriculum } from '#src/organisms/course-curriculum.tsx';
import { trpc } from '#src/utils/trpc.ts';

import { CourseReview } from './course-review.tsx';

interface CourseConclusionProps {
  chapter: CourseChapterResponse;
}

export const CourseConclusion = ({ chapter }: CourseConclusionProps) => {
  const { i18n } = useTranslation();

  const { data: course } = trpc.content.getCourse.useQuery(
    {
      id: chapter.courseId,
      language: i18n.language,
    },
    {
      staleTime: 300_000, // 5 minutes
    },
  );

  const { data: courseProgress, refetch: refetchCourseProgress } =
    trpc.user.courses.getProgress.useQuery(
      {
        courseId: course ? course.id : '',
      },
      {
        enabled: course !== undefined,
      },
    );

  const completeAllChaptersMutation =
    trpc.user.courses.completeAllChapters.useMutation({
      onSuccess: () => {
        refetchCourseProgress();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      },
    });

  const { data: previousCourseReview } =
    trpc.user.courses.getCourseReview.useQuery(
      {
        courseId: course?.id || '',
      },
      {
        enabled: course?.id !== undefined,
      },
    );

  const completedChapters = courseProgress?.[0].chapters;
  const completedChaptersIds = completedChapters?.map((c) => c.chapterId);

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

  return (
    <>
      <h1 className="pb-12">CHAPTERS - FEEDBACK - EXAM</h1>

      {course ? (
        <>
          <CourseCurriculum
            course={course}
            completedChapters={completedChapters?.map(
              (chapter) => chapter.chapterId,
            )}
            nextChapter={courseProgress?.[0].nextChapter?.chapterId}
            hideGithubLink
            displayNotStarted
            expandAll
            className="self-start w-full mt-5 md:mt-10"
          ></CourseCurriculum>
          <Button
            className="ml-auto"
            onClick={() => {
              completeAllChaptersMutation.mutate({
                courseId: chapter.course.id,
                language: chapter.language,
              });
            }}
          >
            {t('dashboard.myCourses.completeAll')}
          </Button>
        </>
      ) : null}

      {unfinishedClassicChapters && unfinishedClassicChapters.length === 0 ? (
        <>
          <div className="bg-gray-100 p-4">
            {previousCourseReview ? (
              <>
                <div className="flex flex-col mx-auto items-center">
                  <img
                    className="size-12"
                    src={heartOrange}
                    alt={t('imagesAlt.contributorHeart')}
                  />
                  <div className="mt-4">
                    {t('courses.review.conclusionFeedback1')}
                  </div>
                  <div>{t('courses.review.conclusionFeedback2')}</div>
                  <div className="mt-4 text-sm">
                    {t('courses.review.conclusionFeedback3')}
                  </div>
                </div>
                <div className="lg:mx-20 mt-6">
                  <CourseReview
                    courseId={course?.id}
                    existingReview={previousCourseReview}
                    isConclusionReview
                  />
                </div>
              </>
            ) : (
              <>
                <div className="lg:mx-20 mt-6">
                  <CourseReview courseId={course?.id} isConclusionReview />
                </div>
              </>
            )}
          </div>
        </>
      ) : null}
    </>
  );
};
