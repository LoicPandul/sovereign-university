import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/router';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { useTrpc } from '../hooks';
import { router } from '../routes';
import { trpc } from '../utils/trpc';

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation();
  const { trpcQueryClient, trpcClient } = useTrpc();

  // Temporary fix: the default language can be en-GB (or equivalent), until it is properly set with the selector
  // and these aren't supported. Fallback to 'en' in that case for now.
  if (i18n.language.includes('-')) {
    i18n.changeLanguage('en');
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={trpcQueryClient}>
      <QueryClientProvider client={trpcQueryClient}>
        <RouterProvider router={router} />
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};
