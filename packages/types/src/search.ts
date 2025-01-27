import type {
  DocumentSchema,
  SearchResponseHit,
} from 'typesense/lib/Typesense/Documents.js';

export interface SearchResult<T extends DocumentSchema = DocumentSchema> {
  results: Array<SearchResponseHit<T>>;
  language: string;
  query: string;
  found: number;
  time: number;
  // Pagination
  nextCursor: number;
  remaining: number;
}
