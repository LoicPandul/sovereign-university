import type { JoinedEvent } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getLecturesQuery } from '../queries/get-lectures.js';

export const createGetLectures = ({ postgres }: Dependencies) => {
  return async (): Promise<JoinedEvent[]> => {
    return postgres.exec(getLecturesQuery());
  };
};
