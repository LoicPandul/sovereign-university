import { firstRow } from '@blms/database';
import type { JoinedEvent } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getEventQuery } from '../queries/get-event.js';

export const createGetEvent = ({ postgres }: Dependencies) => {
  return async (id: string): Promise<JoinedEvent> => {
    const event = await postgres.exec(getEventQuery(id)).then(firstRow);

    if (!event) {
      throw new Error(`Event ${id} not found`);
    }

    return event;
  };
};
