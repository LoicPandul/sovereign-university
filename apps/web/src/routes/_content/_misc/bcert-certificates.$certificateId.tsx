import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { MainLayout } from '#src/components/main-layout.tsx';

export const Route = createFileRoute(
  '/_content/_misc/bcert-certificates/$certificateId',
)({
  params: {
    parse: (params) => ({
      certificateId: z.string().parse(params.certificateId),
    }),
    stringify: ({ certificateId }) => ({ certificateId: `${certificateId}` }),
  },
  component: Certificate,
});

function Certificate() {
  const params = Route.useParams();
  const navigate = useNavigate();

  if (!params.certificateId.startsWith('bcertresults')) {
    navigate({
      to: '/',
    });
  }

  return (
    <MainLayout variant="light" footerVariant="light" fillScreen>
      <img
        src={`/api/files/${decodeURI(params.certificateId)}`}
        alt="Test"
        className="mx-auto mt-10 md:mt-20 px-4"
      />
    </MainLayout>
  );
}
