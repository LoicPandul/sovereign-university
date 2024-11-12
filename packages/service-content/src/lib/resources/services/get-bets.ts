import type { JoinedBet } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getBetsQuery } from '../queries/get-bets.js';

export const createGetBets = ({ postgres }: Dependencies) => {
  return async (language?: string): Promise<JoinedBet[]> => {
    return postgres.exec(getBetsQuery(language));
  };
};
