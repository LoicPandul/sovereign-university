import { createFileRoute, useParams } from '@tanstack/react-router';

import { MainLayout } from '#src/components/main-layout.tsx';

export const Route = createFileRoute(
  '/_content/_misc/exam-certificates/$certificateId',
)({
  component: Certificate,
});

function Certificate() {
  const params = useParams({
    from: '/exam-certificates/$certificateId',
  });

  return (
    <MainLayout variant="light" footerVariant="light" fillScreen>
      <img
        src={`/api/files/certificates/${params['certificateId']}.png`}
        alt="Test"
        className="mx-auto mt-10 md:mt-20 px-4"
      />
    </MainLayout>
  );
}
