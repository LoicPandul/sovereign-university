import type { JoinedCareerProfile } from '@blms/types';

import { firstRow } from '@blms/database';
import type { Dependencies } from '../../../dependencies.js';
import { deleteCareerProfileQuery } from '../queries/delete-career-profile.js';
import { getCareerProfileIdQuery } from '../queries/get-career-profile.js';

interface Options {
  uid: string;
}

export const createDeleteCareerProfile = ({ postgres, s3 }: Dependencies) => {
  return async ({ uid }: Options): Promise<JoinedCareerProfile[]> => {
    const careerProfileId = await postgres
      .exec(getCareerProfileIdQuery(uid))
      .then(firstRow)
      .then((a) => a?.id ?? null);

    if (careerProfileId) {
      try {
        await s3.delete(`cvs/${careerProfileId}`);
      } catch (error) {
        console.error('Failed to delete related CV', careerProfileId, error);
      }
    }

    return postgres.exec(deleteCareerProfileQuery(uid));
  };
};
