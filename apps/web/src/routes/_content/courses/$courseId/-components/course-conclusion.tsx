import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

import type { CourseChapterResponse } from '@blms/types';
import { Button } from '@blms/ui';

import { CourseCurriculum } from '#src/organisms/course-curriculum.tsx';
import { trpc } from '#src/utils/trpc.ts';

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

  console.log('unfinishedClassicChapters', unfinishedClassicChapters);

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
        <h1>TODO add course review ONLY if all chapters are done</h1>
      ) : null}
    </>
  );
};
