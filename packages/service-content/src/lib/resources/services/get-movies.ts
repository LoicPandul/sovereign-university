import type { JoinedMovie } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getMoviesQuery } from '../queries/get-movies.js';

export const createGetMovies = ({ postgres }: Dependencies) => {
  return async (): Promise<JoinedMovie[]> => {
    return postgres.exec(getMoviesQuery());
  };
};
