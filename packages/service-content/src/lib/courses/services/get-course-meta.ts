import { firstRow } from '@blms/database';

import type { CourseMeta } from '@blms/types';
import type { Dependencies } from '../../dependencies.js';
import { getCourseMetaQuery } from '../queries/get-course-meta.js';

export const createGetCourseMeta = ({ postgres }: Dependencies) => {
  return async (id: string, language: string): Promise<CourseMeta> => {
    const course = await postgres
      .exec(getCourseMetaQuery(id, language))
      .then(firstRow);

    if (!course) {
      throw new Error(`Course ${id} not found`);
    }

    return course;
  };
};
