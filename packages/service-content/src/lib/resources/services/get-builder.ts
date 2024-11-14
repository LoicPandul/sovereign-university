import { firstRow } from '@blms/database';
import type { JoinedBuilder } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getBuilderQuery } from '../queries/get-builder.js';

export const createGetBuilder = ({ postgres }: Dependencies) => {
  return async (id: number, language?: string): Promise<JoinedBuilder> => {
    const builder = await postgres
      .exec(getBuilderQuery(id, language))
      .then(firstRow);

    if (!builder) {
      throw new Error('Builder not found');
    }

    return builder;
  };
};
