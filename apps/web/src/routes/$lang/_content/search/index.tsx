import { createFileRoute } from '@tanstack/react-router';
import { default as DOMPurify } from 'dompurify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, cn } from '@blms/ui';

import { PageLayout } from '#src/components/page-layout.tsx';
import { trpc } from '#src/utils/trpc.ts';

import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { IoMdClose } from 'react-icons/io';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import searchErrorIcon from '#src/assets/icons/search-error.svg';
import searchIcon from '#src/assets/icons/search.svg';

import './style.css';
import { getLanguageName } from '#src/utils/i18n.ts';

export const Route = createFileRoute('/$lang/_content/search/')({
  component: SearchPage,
});

function SearchPage() {
  const { t, i18n } = useTranslation();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<Set<string>>(new Set(['all']));

  const [query, setQuery] = useState('');
  const search = trpc.content.search.useInfiniteQuery(
    {
      query,
      language: i18n.language,
      categories: [...categories],
      limit: 10,
    },
    {
      initialCursor: 1,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: query.length > 0, // Only fetch when query has input
    },
  );

  const lastPage = search.data?.pages[search.data.pages.length - 1];

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
      <div className="max-w-6xl pb-8 text-white min-h-[calc(100vh-64px)] mx-2 sm:mx-auto ">
        <h2 className="text-orange-500 text-center text-xl mt-16">
          {t('search.explorer.subtitle')}
        </h2>

        <search className="flex flex-col space-y-4 max-w-2xl mx-auto sm:mb-16">
          <div className="flex items-center gap-4 relative bg-tertiary-10 my-8 h-14 rounded-lg">
            <img
              src={searchIcon}
              alt="search"
              className="absolute size-6 mx-4"
            />

            <input
              id="search"
              className="absolute text-newOrange-1 ps-16 p-4 bg-transparent focus:outline outline-newOrange-1 w-full rounded-lg"
              type="text"
              placeholder={`${t('search.search')}...`}
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query.length > 0 && (
              <IoMdClose
                className="absolute right-4 size-6 cursor-pointer"
                onClick={() => setQuery('')}
              />
            )}
          </div>

          {query.length === 0 && (
            <div>
              <p className="text-center text-xl mt-16">
                {t('search.startSearch')}
              </p>
            </div>
          )}
        </search>

        <div>
          {search.isLoading && <p>Loading...</p>}
          {search.isError && (
            <p className="text-red-500">{t('search.resultError')}</p>
          )}
          {lastPage && (
            <>
              {lastPage.found > 0 && (
                <div className="mb-4 ps-2">
                  <div className="flex flex-col space-y-4 text-base mb-4">
                    <div className={cn(query.length > 0 ? '' : 'hidden')}>
                      <Button
                        className="flex justify-start items-center gap-2 p-0"
                        variant="ghost"
                        onClick={() => setFiltersOpen(!filtersOpen)}
                      >
                        <HiOutlineAdjustmentsHorizontal className="size-6 stroke-[1.5]" />

                        <p className={cn(filtersOpen && 'underline')}>
                          {t('search.filterByType')}
                        </p>

                        {filtersOpen ? (
                          <MdKeyboardArrowUp className="size-6" />
                        ) : (
                          <MdKeyboardArrowDown className="size-6" />
                        )}
                      </Button>
                    </div>

                    <div
                      className={cn(
                        'flex items-center gap-8 font-medium',
                        filtersOpen ? 'flex' : 'hidden',
                      )}
                    >
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={
                            categories.has('all') ? 'primary' : 'outlineWhite'
                          }
                          size="s"
                          onClick={() => setCategories(new Set(['all']))}
                        >
                          {t('search.all')}
                        </Button>

                        {filters.slice(1).map((filter) => (
                          <Button
                            key={filter}
                            variant={
                              categories.has(filter)
                                ? 'primary'
                                : 'outlineWhite'
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

                  <p className="text-gray-300 font-light text-sm mb-6">
                    {t('search.languageSelected', {
                      language: getLanguageName(i18n.language),
                    })}
                  </p>

                  <p className="mb-1">{t('search.searchResult')}</p>

                  <p className="text-gray-300 font-light text-sm mb-8">
                    {t('search.resultInfo', {
                      count: lastPage.found,
                      time: lastPage.time,
                    })}
                  </p>
                </div>
              )}

              <ul className="search-results">
                {search.data?.pages
                  .flatMap((page) => page.results)
                  .map((item, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: react complains otherwise
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
                              // biome-ignore lint/security/noDangerouslySetInnerHtml: html is sanitized
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
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: html is sanitized
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

              {lastPage && search.data?.pages?.[0].found === 0 && (
                <div className="flex flex-col items-center space-y-8 mt-12 max-w-xl mx-auto text-center">
                  <img src={searchErrorIcon} alt="search error" />

                  <p>{t('search.resultEmpty')}</p>
                </div>
              )}

              {lastPage.remaining > 0 && (
                <div className="flex flex-col justify-center items-center gap-4 mt-16">
                  <Button
                    onClick={() => search.fetchNextPage()}
                    disabled={search.isFetchingNextPage}
                    variant="tertiary"
                  >
                    {t('search.loadMoreResults')}
                  </Button>

                  <div>
                    (
                    {t('search.resultsRemaining', {
                      count: lastPage.remaining,
                    })}
                    )
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
