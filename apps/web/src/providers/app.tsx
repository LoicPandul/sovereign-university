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
import { ToastContainer } from 'react-toastify';

import PageMeta from '#src/components/Head/PageMeta/index.js';
import { router } from '#src/routes/-router.js';
import { SITE_NAME } from '#src/utils/meta.js';

import { useTrpc } from '../hooks/index.ts';
import { LANGUAGES } from '../utils/i18n.ts';
import { trpc } from '../utils/trpc.ts';

import { AuthModalProvider } from './auth.tsx';
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

  function updateCurrentLanguage(newLanguage: string, path: string) {
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);

    router.update({
      basepath: newLanguage,
      context: router.options.context,
    });

    router.navigate({
      to: path,
      replace: true,
    });

    router.load();
  }

  useLayoutEffect(() => {
    setCurrentLanguage(i18n.resolvedLanguage);
  }, [i18n]);

  // Handle language change
  useEffect(() => {
    const newLanguage = currentLanguage ? currentLanguage : i18n.language;

    if (!currentLanguage || currentLanguage !== i18n.language) {
      updateCurrentLanguage(newLanguage, location.pathname + location.hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage, i18n, i18n.language, locationLanguage]);

  // Handle browser's back() and next()
  useEffect(() => {
    const handlePopState = () => {
      const pathName = location.pathname;
      const path = pathName.slice(pathName.indexOf('/', 2)) + location.hash;
      const newLanguage = pathName.slice(
        pathName.indexOf('/') + 1,
        pathName.indexOf('/', 1),
      );

      updateCurrentLanguage(newLanguage, path);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage]);

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
              <AuthModalProvider>
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
                <ToastContainer autoClose={5000} />
                {children}
              </AuthModalProvider>
            </AppContextProvider>
          </LangContext.Provider>
        </QueryClientProvider>
      </trpc.Provider>
    </HelmetProvider>
  );
};
