import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { trpc } from '#src/utils/trpc.js';

import { LegalMarkdownComponent } from '../../-components/public-communication/legal-markdown.tsx';

export const Route = createFileRoute(
  '/$lang/_content/_misc/public-communication/legals/$name',
)({
  params: {
    parse: (params) => ({
      name: z.string().parse(params.name),
    }),
    stringify: ({ name }) => ({ name: `${name}` }),
  },
  component: LegalInformationTab,
});

function LegalInformationTab() {
  const { i18n } = useTranslation();
  const params = Route.useParams();
  const name = params.name;

  const { data: legal, isFetched } = trpc.content.getLegal.useQuery({
    name,
    language: i18n.language,
  });

  if (isFetched && !legal) {
    return <div className="text-black">Legal information not found!</div>;
  }

  return <LegalMarkdownComponent content={legal?.rawContent} />;
}
