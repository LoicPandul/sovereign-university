import { Link } from '@tanstack/react-router';
import { t } from 'i18next';
import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { JoinedCourseWithAll } from '@blms/types';
import { DividerSimple } from '@blms/ui';

import { AuthorCard } from '#src/components/author-card.tsx';
import { ProofreadingDesktop } from '#src/components/proofreading-progress.tsx';
import { ButtonWithArrow } from '#src/molecules/button-arrow.tsx';
import { CourseCard } from '#src/organisms/course-card.tsx';
import { AppContext } from '#src/providers/context.tsx';
import { filterAndRandomizeCourses } from '#src/routes/_content/_misc/exam-certificates.$certificateId.js';
import { formatNameForURL } from '#src/utils/string.ts';
import { trpc } from '#src/utils/trpc.ts';

interface ConclusionFinishProps {
  course: JoinedCourseWithAll;
}

export const ConclusionFinish = ({ course }: ConclusionFinishProps) => {
  const { session } = useContext(AppContext);

  return (
    <>
      <DividerSimple className="mb-5 md:mb-8" />
      <Professor course={course} addThanksTipping />
      <Credits course={course} />
      <OtherCourses course={course} />
      {session?.user && (
        <Link
          to="/dashboard/courses"
          className="max-md:hidden mt-8 inline-flex"
        >
          <ButtonWithArrow variant="primary" size="l">
            {t('dashboard.backToDashboard')}
          </ButtonWithArrow>
        </Link>
      )}
    </>
  );
};

const Professor = ({
  course,
}: {
  course: JoinedCourseWithAll;
  addThanksTipping?: boolean;
}) => {
  return (
    <section className="w-full flex flex-col">
      <h4 className="subtitle-medium-caps-18px text-darkOrange-5">
        {t('words.professor')}
      </h4>
      <p className="mt-[15px] md:mt-6 label-large-20px md:display-small-32px text-black">
        {t('courses.details.taughtBy')}{' '}
        <span className="text-darkOrange-5 label-large-20px md:display-small-32px">
          {course.professors.map((professor, index) => (
            <React.Fragment key={professor.id}>
              <Link
                to={`/professor/${formatNameForURL(professor.name || '')}-${professor.id}`}
                className="hover:text-darkOrange-5 hover:font-medium"
              >
                {professor.name}
              </Link>
              {index < course.professors.length - 2
                ? ', '
                : index === course.professors.length - 2
                  ? ' & '
                  : ''}
            </React.Fragment>
          ))}
        </span>
      </p>
      <p className="md:mt-6 text-newBlack-1 md:text-justify body-16px md:label-large-20px max-md:hidden">
        {t('courses.details.thanksTipping')}
      </p>
      <div className="flex h-fit flex-col max-md:gap-4">
        {course.professors.map((professor) => (
          <AuthorCard
            key={professor.id}
            professor={professor}
            hasDonateButton
            centeredContent={true}
            mobileSize="medium"
          />
        ))}
      </div>
    </section>
  );
};

const Credits = ({ course }: { course: JoinedCourseWithAll }) => {
  const { i18n } = useTranslation();

  const { data: proofreading } = trpc.content.getProofreading.useQuery({
    language: i18n.language,
    courseId: course.id,
  });

  if (!proofreading || proofreading?.contributorsId.length === 0) {
    return null;
  }

  return (
    <>
      <DividerSimple className="my-5 md:mt-3 md:mb-8" />
      <section className="w-full flex flex-col">
        <h4 className="subtitle-medium-caps-18px text-darkOrange-5">
          {t('words.credits')}
        </h4>
        <p className="mt-[15px] md:mt-6 label-large-20px md:display-small-32px text-black">
          {t('courses.details.hasBeenProofreadBy')}{' '}
          <span className="text-darkOrange-5 label-large-20px md:display-small-32px">
            {proofreading?.contributorsId.map((proofreader, index) => (
              <React.Fragment key={proofreader}>
                <span>{proofreader}</span>
                {index < course.professors.length - 2
                  ? ', '
                  : index === course.professors.length - 2
                    ? ' & '
                    : ''}
              </React.Fragment>
            ))}
          </span>
        </p>
        <p className="my-[25px] md:mt-6 md:mb-8 text-newBlack-1 md:text-justify body-16px md:subtitle-large-18px whitespace-pre-line">
          <Trans i18nKey="courses.details.collaborativeEffort">
            <a
              className="hover:text-darkOrange-5 font-medium"
              href="https://creativecommons.org/licenses/by-sa/4.0/deed.en"
              target="_blank"
              rel="noreferrer"
            >
              CC BY-SA
            </a>
          </Trans>
        </p>
        <ProofreadingDesktop
          mode="light"
          proofreadingData={{
            contributors: proofreading.contributorsId,
            reward: proofreading.reward,
          }}
          standalone
          variant="vertical"
        />
      </section>
    </>
  );
};

const OtherCourses = ({ course }: { course: JoinedCourseWithAll }) => {
  const { courses: allCourses } = useContext(AppContext);

  if (!allCourses || allCourses.length === 0) {
    return null;
  }

  const selectedCourses = filterAndRandomizeCourses(course, allCourses);

  return (
    <>
      <DividerSimple className="my-5 md:my-8" />
      <section className="w-full flex flex-col">
        <h4 className="subtitle-medium-caps-18px text-darkOrange-5">
          {t('courses.details.otherCourses')}
        </h4>
        <p className="mt-1 md:mt-6 label-large-20px md:display-small-32px text-black">
          {t('courses.details.otherCoursesInterest')}
        </p>
      </section>
      <section className="flex max-md:flex-col gap-6 md:gap-5 items-center mt-1 md:mt-8">
        {selectedCourses.map((course) => (
          <CourseCard key={course.id} course={course} mode="light" />
        ))}
      </section>
    </>
  );
};
