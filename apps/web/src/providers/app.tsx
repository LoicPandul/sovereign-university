import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import {
  type PropsWithChildren,
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import PageMeta from '#src/components/Head/PageMeta/index.js';
import { router } from '#src/routes/-router.js';
import { SITE_NAME } from '#src/utils/meta.js';

import { useTrpc } from '../hooks/index.ts';
import { LANGUAGES } from '../utils/i18n.ts';
import { trpc } from '../utils/trpc.ts';

import { AppContextProvider } from './context.tsx';

interface LangContext {
  setCurrentLanguage: (lang: string) => void;
}

export const LangContext = createContext<LangContext>({
  setCurrentLanguage: () => {},
});

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { i18n } = useTranslation();

  const { trpcQueryClient, trpcClient } = useTrpc();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
          },
        },
      }),
  );

  const locationLanguage = ((l) =>
    l && (LANGUAGES.includes(l) ? l : undefined))(
    location.pathname.split('/')[1],
  );
  const [currentLanguage, setCurrentLanguage] = useState(locationLanguage);

  // Temporary fix: the default language can be en-GB (or equivalent), until it is properly set with the selector
  // and these aren't supported. Fallback to 'en' in that case for now.
  useLayoutEffect(() => {
    if (
      i18n.language.includes('-') &&
      i18n.language.toLowerCase() !== 'zh-hans'
    ) {
      i18n.changeLanguage('en');
      setCurrentLanguage('en');
    }
  }, [i18n]);

  useEffect(() => {
    const newLanguage = currentLanguage ? currentLanguage : i18n.language;

    i18n.changeLanguage(newLanguage);

    if (!currentLanguage || currentLanguage !== i18n.language) {
      setCurrentLanguage(newLanguage);

      router.update({
        basepath: newLanguage,
        context: router.options.context,
      });

      router.navigate({
        to: location.pathname,
        replace: true,
      });

      router.load();
    }
  }, [currentLanguage, i18n, i18n.language, locationLanguage]);

  return (
    <HelmetProvider>
      <trpc.Provider
        client={trpcClient}
        // @ts-expect-error TODO: fix this, open issue, idk
        queryClient={queryClient}
      >
        <QueryClientProvider client={trpcQueryClient}>
          <LangContext.Provider value={{ setCurrentLanguage }}>
            <AppContextProvider>
              <RouterProvider
                router={router}
                context={{ i18n }}
                basepath={currentLanguage}
              />
              <PageMeta
                title={SITE_NAME}
                description="Let's build together the Bitcoin educational layer"
                type="website"
                imageSrc="/share-default.jpg"
              />
              {children}
            </AppContextProvider>
          </LangContext.Provider>
        </QueryClientProvider>
      </trpc.Provider>
    </HelmetProvider>
  );
};
