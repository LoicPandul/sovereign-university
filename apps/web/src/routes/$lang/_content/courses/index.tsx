import { createFileRoute } from '@tanstack/react-router';
import { t } from 'i18next';

import { Loader } from '@blms/ui';

import { BCertificatePresentation } from '#src/components/b-certificate-presentation.js';
import { PageLayout } from '#src/components/page-layout.js';

import { useContext } from 'react';
import { AppContext } from '#src/providers/context.tsx';
import { CourseSelector } from './-components/course-selector.tsx';
import { CoursesGallery } from './-components/courses-gallery.tsx';

export const Route = createFileRoute('/$lang/_content/courses/')({
  component: CoursesExplorer,
});

function CoursesExplorer() {
  const { courses } = useContext(AppContext);
  const filteredCourses = courses
    ? courses.filter((course) => course.isArchived === false)
    : [];

  return (
    <PageLayout
      title={t('courses.explorer.exploreCourses')}
      subtitle={t('courses.explorer.journey')}
      description={t('courses.explorer.pageDescription')}
      paddingXClasses="px-0"
      maxWidth="max-w-[3000px]"
    >
      {!filteredCourses && <Loader size={'s'} />}

      <div className="max-w-[1227px] mx-auto px-2.5">
        {filteredCourses && <CoursesGallery courses={filteredCourses} />}
      </div>
      <div className="border-t border-newGray-1 max-w-[300px] md:max-w-[730px] xl:max-w-[1115px] w-full mx-auto" />
      <div className="bg-[linear-gradient(180deg,_#000_0%,_#853000_50.5%,_#000_99.5%)] w-full py-5 lg:py-[60px]">
        <BCertificatePresentation marginClasses="mt-0 !border-0 !shadow-none text-center lg:text-start" />
      </div>
      <div className="border-t border-newGray-1 max-w-[300px] md:max-w-[730px] xl:max-w-[1115px] w-full mx-auto" />

      {filteredCourses && (
        <div className="max-w-[1227px] mx-auto px-[15px]">
          <p className="mobile-h3 md:desktop-h6 max-w-[451px] text-center mx-auto mt-6 mb-5 md:mt-16 md:mb-10">
            {t('courses.explorer.findCourses')}
          </p>
          <CourseSelector courses={filteredCourses} />
        </div>
      )}
    </PageLayout>
  );
}
