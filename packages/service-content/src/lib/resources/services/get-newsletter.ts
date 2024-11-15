import { firstRow } from '@blms/database';
import type { JoinedNewsletter } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getNewsletterQuery } from '../queries/get-newsletter.js';

export const createGetNewsletter = ({ postgres }: Dependencies) => {
  return async (id: number, language: string): Promise<JoinedNewsletter> => {
    const newsletter = await postgres
      .exec(getNewsletterQuery(id, language))
      .then(firstRow);

    if (!newsletter) {
      throw new Error('Newsletter not found');
    }

    return newsletter;
  };
};
