import { createFileRoute } from '@tanstack/react-router';
import { default as DOMPurify } from 'dompurify';
import { useState } from 'react';

import { trpc } from '#src/utils/trpc.ts';

import './style.css';

export const Route = createFileRoute('/_content/search/')({
  component: SearchPage,
});

function SearchPage() {
  const [language, setLanguage] = useState('en');
  const [category, setCategory] = useState('');

  const [query, setQuery] = useState('');
  const { data, isLoading, isError } = trpc.content.search.useQuery(
    { query, language, category },
    {
      enabled: query.length > 0, // Only fetch when query has input
    },
  );

  return (
    <div className="max-w-4xl mx-auto py-16 text-white border-x min-h-screen px-4">
      <search>
        <label htmlFor="search" className="block text-xl font-bold">
          Search
        </label>

        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="block mb-2 text-white bg-newBlack-2 p-4 focus:outline outline-blue-500 outline-2 rounded w-full"
        >
          <option value="id">Indonesian</option>
          <option value="en">English</option>
          <option value="fi">Finnish</option>
          <option value="et">Estonian</option>
          <option value="ru">Russian</option>
          <option value="vi">Vietnamese</option>
          <option value="pt">Portuguese</option>
          <option value="ja">Japanese</option>
          <option value="cs">Czech</option>
          <option value="zh-hans">Chinese</option>
          <option value="nb-no">Norwegian</option>
          <option value="it">Italian</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="fr">French</option>
        </select>

        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block mb-2 text-white bg-newBlack-2 p-4 focus:outline outline-blue-500 outline-2 rounded w-full"
        >
          <option value="">All categories</option>
          <option value="course_part">Course part</option>
          <option value="course_chapter">Chapter</option>
        </select>

        <input
          id="search"
          className="text-white bg-newBlack-2 p-4 focus:outline outline-blue-500 outline-2 rounded w-full"
          type="text"
          placeholder="Search..."
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </search>

      <div className="mt-8">
        {isLoading && <p>Loading...</p>}
        {isError && (
          <p className="text-red-500">
            Something went wrong. Please try again.
          </p>
        )}
        {data && (
          <>
            {data.found && (
              <div className="ps-2 text-gray-500 font-light text-sm">
                <p>
                  Found {data.found} results in {data.time}ms
                </p>
              </div>
            )}

            <ul className="search-results">
              {data.results.map((item, index) => (
                <li key={index} className="mt-2">
                  <a
                    className="block bg-white/5 rounded p-2 hover:bg-white/10"
                    href={item.document.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="flex gap-4 items-center">
                      <span className="bg-orange-400 px-2 py-1 rounded">
                        {item.document.type}
                      </span>

                      {item.highlight.title ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              item.highlight.title?.snippet ?? '',
                            ),
                          }}
                        ></div>
                      ) : (
                        <div>{item.document.title}</div>
                      )}
                    </div>

                    {item.highlight.body && (
                      <div
                        className="ps-2 pt-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            item.highlight.body?.snippet ?? '',
                          ),
                        }}
                      ></div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
