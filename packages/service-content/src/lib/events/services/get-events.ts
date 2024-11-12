import type { JoinedEvent } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getRecentEventsQuery } from '../queries/get-events.js';

export const createGetRecentEvents = ({ postgres }: Dependencies) => {
  return (): Promise<JoinedEvent[]> => {
    return postgres.exec(getRecentEventsQuery());
  };
};
