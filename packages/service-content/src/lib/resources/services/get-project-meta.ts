import { firstRow } from '@blms/database';

import type { Dependencies } from '../../dependencies.js';
import { getProjectMetaQuery } from '../queries/get-project-meta.js';

export const createGetProjectMeta = ({ postgres }: Dependencies) => {
  return async (id: number, language?: string) => {
    const project = await postgres
      .exec(getProjectMetaQuery(id, language))
      .then(firstRow);

    if (!project) {
      throw new Error('Builder not found');
    }

    return project;
  };
};
