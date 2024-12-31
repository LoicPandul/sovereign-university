import { firstRow } from '@blms/database';
import type { JoinedEvent } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import {
  getLecturePaymentQuery,
  getLectureQuery,
} from '../queries/get-lecture.js';

export const createGetLecture = ({ postgres }: Dependencies) => {
  return async (id: string, uid: string): Promise<JoinedEvent> => {
    const lecture = await postgres.exec(getLectureQuery(id)).then(firstRow);

    if (!lecture) {
      throw new Error('Lecture not found');
    }

    if (lecture.priceDollars && lecture.priceDollars > 0) {
      const payment = uid
        ? await postgres.exec(getLecturePaymentQuery(id, uid)).then(firstRow)
        : null;

      if (!payment) {
        lecture.replayUrl = null;
        lecture.liveUrl = null;
      }
    }

    return lecture;
  };
};
