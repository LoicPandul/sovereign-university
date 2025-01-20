import type { SearchResult } from '@blms/types';

import type { Dependencies } from '#src/lib/dependencies.js';
import type { Searchable } from '#src/lib/search.js';

interface SearchInput {
  categories?: string[];
  language: string;
  query: string;
}

const searchCategoryMap: Record<string, string[] | null> = {
  courses: ['course', 'course_part', 'course_chapter'],
  books: ['book'],
  words: ['glossary_word'],
  podcasts: ['podcast'],
  tutorials: ['tutorial'],
  professors: ['professor'],
  all: null,
  '': null,
};

export const createSearch = ({ typesense }: Dependencies) => {
  const searchContent = (search: SearchInput) => {
    const categories = (search.categories ?? ['all'])
      .map((category) => searchCategoryMap[category])
      .filter(Boolean)
      .flat();

    const language = search.language.toLowerCase();

    let filter = `language:${language}`;
    if (categories) {
      const map = categories
        .map((category) => `type:${category}`)
        .filter(Boolean)
        .join(' || ');

      filter += map && ` && (${map})`;
    }

    console.log('Searching for:', { language, categories, filter });

    return typesense.collections<Searchable>('searchable').documents().search({
      q: search.query,
      query_by: 'title,body',
      query_by_weights: '3,1',
      sort_by: '_text_match:desc',
      highlight_affix_num_tokens: 20,
      search_cutoff_ms: 500, // search for 500ms max
      prioritize_exact_match: true,
      filter_by: filter,
    });
  };

  return async (search: SearchInput): Promise<SearchResult<Searchable>> => {
    console.log('searching for:', search);

    const searchResult: SearchResult<Searchable> = {
      results: [],
      ...search,
      found: 0,
      time: 0,
    };

    const result = await searchContent(search) //
      .catch((error) => ({ error }));

    if ('error' in result) {
      console.error('Failed to search:', result.error);
      return searchResult;
    }

    searchResult.results = result.hits ?? [];
    searchResult.found = result.found;
    searchResult.time = result.search_time_ms;

    return searchResult;
  };
};
