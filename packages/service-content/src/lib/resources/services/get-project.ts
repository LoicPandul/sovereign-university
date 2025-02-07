import { firstRow } from '@blms/database';
import type { JoinedProject } from '@blms/types';

import type { Dependencies } from '../../dependencies.js';
import { getProjectQuery } from '../queries/get-project.js';

export const createGetProject = ({ postgres }: Dependencies) => {
  return async (id: number, language?: string): Promise<JoinedProject> => {
    const project = await postgres
      .exec(getProjectQuery(id, language))
      .then(firstRow);

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  };
};
