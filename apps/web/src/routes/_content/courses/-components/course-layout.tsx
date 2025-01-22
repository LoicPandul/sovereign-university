import { MainLayout } from '#src/components/main-layout.js';

import type { JSX } from 'react';

export const CourseLayout = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <MainLayout variant="light">
      <div className="flex flex-col grow w-full bg-white relative">
        {children}
      </div>
    </MainLayout>
  );
};
