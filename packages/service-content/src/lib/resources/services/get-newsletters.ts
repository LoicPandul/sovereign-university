import type { JoinedNewsletter } from '@blms/types';

import type { Dependencies } from '#src/lib/dependencies.js';

import { getNewslettersQuery } from '../queries/get-newsletters.js';

export const createGetNewsletters = ({ postgres }: Dependencies) => {
  return (language?: string): Promise<JoinedNewsletter[]> => {
    return postgres.exec(getNewslettersQuery(language));
  };
};
