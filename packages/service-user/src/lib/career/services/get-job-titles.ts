import type { Dependencies } from '../../../dependencies.js';
import { getJobTitlesQuery } from '../queries/get-job-titles.js';

export const createGetJobTitles = ({ postgres }: Dependencies) => {
  return async () => {
    const jobTitles = await postgres.exec(getJobTitlesQuery());

    if (!jobTitles) {
      return null;
    }

    return jobTitles;
  };
};
