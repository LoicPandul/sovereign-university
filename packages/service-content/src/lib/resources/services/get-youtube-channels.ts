import type { JoinedYoutubeChannel } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getYoutubeChannelsQuery } from '../queries/get-youtube-channels.js';

export const createGetYoutubeChannels = ({ postgres }: Dependencies) => {
  return async (): Promise<JoinedYoutubeChannel[]> => {
    return postgres.exec(getYoutubeChannelsQuery());
  };
};
