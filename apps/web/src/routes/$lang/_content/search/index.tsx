import { createFileRoute } from '@tanstack/react-router';
import { default as DOMPurify } from 'dompurify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@blms/ui';

import { PageLayout } from '#src/components/page-layout.tsx';
import { trpc } from '#src/utils/trpc.ts';

import './style.css';

export const Route = createFileRoute('/$lang/_content/search/')({
  component: SearchPage,
});

function SearchPage() {
  const { t, i18n } = useTranslation();

  const [categories, setCategories] = useState<Set<string>>(new Set(['all']));

  const [query, setQuery] = useState('');
  const { data, isLoading, isError } = trpc.content.search.useQuery(
    { query, language: i18n.language, categories: [...categories] },
    {
      enabled: query.length > 0, // Only fetch when query has input
    },
  );

  const filters = [
    'all', //
    'courses',
    'books',
    'words',
    'podcasts',
    'tutorials',
    'professors',
  ];

  const createSetToggle = (
    target: Set<string>,
    dispatch: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) => {
    return (filter: string) => {
      if (filter === 'all') {
        dispatch(new Set(['all']));
      } else {
        const isSelected = target.has(filter);
        let newSelection = isSelected
          ? new Set([...target].filter((i) => i !== filter))
          : new Set([...target].filter((i) => i !== 'all')).add(filter);

        if (newSelection.size === 0) {
          newSelection = new Set(['all']);
        }

        dispatch(newSelection);
      }
    };
  };

  const toggleFilter = createSetToggle(categories, setCategories);

  return (
    <PageLayout
      paddingXClasses="px-0"
      maxWidth="max-w-[3000px]"
      title={t('search.explorer.title')}
      subtitle={' '}
    >
      <div className="max-w-6xl mx-auto pb-8 text-white min-h-[calc(100vh-64px)]">
        <h2 className="text-orange-500 text-center text-xl pb-8">
          {t('search.explorer.subtitle')}
        </h2>

        <search className="flex flex-col space-y-4">
          <label htmlFor="search" className="block text-xl font-bold">
            {t('search.search')} ({i18n.language})
          </label>

          <div className="flex flex-col p-5 gap-8 bg-newBlack-2 rounded-lg">
            <div className="flex items-center gap-8 font-medium">
              <p>{t('search.categories')}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={categories.has('all') ? 'primary' : 'outlineWhite'}
                  size="s"
                  onClick={() => setCategories(new Set(['all']))}
                >
                  {t('search.all')}
                </Button>
                {filters.slice(1).map((filter) => (
                  <Button
                    key={filter}
                    variant={
                      categories.has(filter) ? 'primary' : 'outlineWhite'
                    }
                    size="s"
                    onClick={() => {
                      toggleFilter(filter);
                    }}
                    className="capitalize"
                  >
                    {`${t(`search.${filter}`)}`}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <input
            id="search"
            className="text-white bg-tertiary-10 p-4 focus:outline outline-blue-500 outline-2 w-full rounded-lg"
            type="text"
            placeholder={`${t('search.search')}...`}
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </search>

        <div className="mt-8">
          {isLoading && <p>Loading...</p>}
          {isError && <p className="text-red-500">{t('search.resultError')}</p>}
          {data && (
            <>
              {data.found && (
                <div className="ps-2 text-gray-500 font-light text-sm">
                  <p>
                    {t('search.resultInfo', {
                      count: data.found,
                      time: data.time,
                    })}
                  </p>
                </div>
              )}

              <ul className="search-results">
                {data.results.map((item, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <li key={index} className="mt-2">
                    <a
                      className="block bg-white/5 rounded p-2 hover:bg-white/10"
                      href={item.document.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="flex gap-4 items-center">
                        <span className="bg-tertiary-10 px-2 py-1 rounded">
                          {t(`search.${item.document.type}`)}
                        </span>

                        {item.highlight.title ? (
                          <div
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                item.highlight.title?.snippet ?? '',
                              ),
                            }}
                          />
                        ) : (
                          <div>{item.document.title}</div>
                        )}
                      </div>

                      {item.highlight.body && (
                        <div
                          className="ps-2 pt-2"
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              item.highlight.body?.snippet ?? '',
                            ),
                          }}
                        />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
