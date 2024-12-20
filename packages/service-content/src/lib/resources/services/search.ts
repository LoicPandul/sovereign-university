import type { SearchResult } from '@blms/types';

import type { Dependencies } from '#src/lib/dependencies.js';
import type { Searchable } from '#src/lib/search.js';

interface SearchInput {
  category?: string;
  language: string;
  query: string;
}

export const createSearch = ({ typesense }: Dependencies) => {
  const searchContent = (search: SearchInput) => {
    return typesense
      .collections<Searchable>('searchable')
      .documents()
      .search({
        q: search.query,
        query_by: 'title,body',
        query_by_weights: '3,1',
        sort_by: '_text_match:desc',
        highlight_affix_num_tokens: 20,
        search_cutoff_ms: 500, // search for 500ms max
        prioritize_exact_match: true,
        filter_by:
          `language:${search.language}` +
          (search.category ? `&& type:${search.category}` : ''),
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
