import type { JoinedBuilder } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getProjectQuery } from '../queries/get-projects.js';

export const createGetProjects = ({ postgres }: Dependencies) => {
  return (language?: string): Promise<JoinedBuilder[]> => {
    return postgres.exec(getProjectQuery(language));
  };
};
