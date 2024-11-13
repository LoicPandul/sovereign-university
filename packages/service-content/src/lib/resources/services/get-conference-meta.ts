import { firstRow } from '@blms/database';

import type { Dependencies } from '../../dependencies.js';
import { getConferenceMetaQuery } from '../queries/get-conference-meta.js';

export const createGetConferenceMeta = ({ postgres }: Dependencies) => {
  return async (id: number) => {
    const conference = await postgres
      .exec(getConferenceMetaQuery(id))
      .then(firstRow);

    if (!conference) {
      throw new Error(`Conference ${id} not found`);
    }

    return conference;
  };
};
