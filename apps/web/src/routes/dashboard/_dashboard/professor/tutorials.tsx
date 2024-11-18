import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';

import { AppContext } from '#src/providers/context.js';

import { DashboardTutorialsPanel } from '../-components/tutorials-panel.tsx';

export const Route = createFileRoute(
  '/dashboard/_dashboard/professor/tutorials',
)({
  component: DashboardProfessorTutorials,
});

function DashboardProfessorTutorials() {
  const navigate = useNavigate();

  const { user, session } = useContext(AppContext);
  if (!session) {
    navigate({ to: '/' });
  } else if (
    session?.user.role !== 'admin' &&
    session?.user.role !== 'superadmin' &&
    session?.user.role !== 'professor'
  ) {
    navigate({ to: '/dashboard/courses' });
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-10">
      <DashboardTutorialsPanel professorId={user?.professorId ?? undefined} />
    </div>
  );
}
