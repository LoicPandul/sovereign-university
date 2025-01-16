import type { JoinedCareerProfile } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { insertCareerProfileQuery } from '../queries/insert-career-profile.js';

interface Options {
  uid: string;
}

export const createInsertCareerProfile = ({ postgres }: Dependencies) => {
  return ({ uid }: Options): Promise<JoinedCareerProfile[]> => {
    return postgres.exec(insertCareerProfileQuery(uid));
  };
};
