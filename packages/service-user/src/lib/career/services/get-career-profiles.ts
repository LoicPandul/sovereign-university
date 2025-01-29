import type { JoinedCareerProfile } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { getCareerProfilesQuery } from '../queries/get-career-profiles.js';

export const createGetCareerProfiles = ({ postgres }: Dependencies) => {
  return async (): Promise<JoinedCareerProfile[] | null> => {
    const careerProfiles = await postgres.exec(getCareerProfilesQuery());

    if (!careerProfiles) {
      return null;
    }

    return careerProfiles;
  };
};
