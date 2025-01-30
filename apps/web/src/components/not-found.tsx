import { MainLayout } from './main-layout.tsx';
import { NotFoundDashboard } from './not-found-dashboard.tsx';

export function NotFound() {
  return (
    <MainLayout footerVariant="dark">
      <NotFoundDashboard />
    </MainLayout>
  );
}
