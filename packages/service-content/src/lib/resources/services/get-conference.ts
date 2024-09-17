import { firstRow } from '@blms/database';
import type { GetConferenceResponse } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { computeAssetCdnUrl } from '../../utils.js';
import { getConferenceQuery } from '../queries/get-conference.js';

export const createGetConference = ({ postgres }: Dependencies) => {
  return async (id: number): Promise<GetConferenceResponse> => {
    const conference = await postgres
      .exec(getConferenceQuery(id))
      .then(firstRow);

    if (!conference) {
      throw new Error(`Conference ${id} not found`);
    }

    return {
      ...conference,
      thumbnail: computeAssetCdnUrl(
        conference.lastCommit,
        conference.path,
        'thumbnail.webp',
      ),
    };
  };
};
