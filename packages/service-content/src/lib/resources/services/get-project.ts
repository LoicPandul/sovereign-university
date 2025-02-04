import { firstRow } from '@blms/database';
import type { JoinedBuilder } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getProjectQuery } from '../queries/get-project.js';

export const createGetProject = ({ postgres }: Dependencies) => {
  return async (id: number, language?: string): Promise<JoinedBuilder> => {
    const builder = await postgres
      .exec(getProjectQuery(id, language))
      .then(firstRow);

    if (!builder) {
      throw new Error('Builder not found');
    }

    return builder;
  };
};
