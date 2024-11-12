import type { JoinedBook } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getBooksQuery } from '../queries/get-books.js';

export const createGetBooks = ({ postgres }: Dependencies) => {
  return (language?: string): Promise<JoinedBook[]> => {
    return postgres.exec(getBooksQuery(language));
  };
};
