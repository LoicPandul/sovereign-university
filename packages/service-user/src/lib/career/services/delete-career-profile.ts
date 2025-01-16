import type { JoinedCareerProfile } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { deleteCareerProfileQuery } from '../queries/delete-career-profile.js';

interface Options {
  uid: string;
}

export const createDeleteCareerProfile = ({ postgres }: Dependencies) => {
  return ({ uid }: Options): Promise<JoinedCareerProfile[]> => {
    return postgres.exec(deleteCareerProfileQuery(uid));
  };
};
