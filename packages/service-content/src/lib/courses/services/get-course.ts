import { firstRow } from '@blms/database';
import type { CourseResponse } from '@blms/types';


import type { Dependencies } from '../../dependencies.js';
import { getProfessorsQuery } from '../../professors/queries/get-professors.js';
import { formatProfessor } from '../../professors/services/utils.js';
import { indexBy } from '../../utils.js';
import { getCourseChaptersQuery } from '../queries/get-course-chapters.js';
import { getCoursePartsQuery } from '../queries/get-course-parts.js';
import { getCourseQuery } from '../queries/get-course.js';

export const createGetCourse = ({ postgres }: Dependencies) => {
  return async (id: string, language: string): Promise<CourseResponse> => {
    const course = await postgres
      .exec(getCourseQuery(id, language))
      .then(firstRow);

    if (!course) {
      throw new Error(`Course ${id} not found`);
    }

    const parts = await postgres.exec(getCoursePartsQuery(id, language));
    const chapters = await postgres.exec(
      getCourseChaptersQuery({ courseId: id, language }),
    );

    const professors = await postgres.exec(
      getProfessorsQuery({ contributorIds: course.professors, language }),
    );

    const professorsMap = indexBy(professors, 'contributorId');

    const sortedProfessors = course.professors
      .map((contributorId) => professorsMap.get(contributorId))
      .filter((p) => p !== undefined);

    const partsWithChapters = parts.map((part) => ({
      ...part,
      chapters: chapters.filter((chapter) => chapter.partId === part.partId),
    }));

    return {
      ...course,
      professors: sortedProfessors.map((element) => formatProfessor(element)),
      parts: partsWithChapters,
      partsCount: parts.length,
      chaptersCount: chapters.length,
    };
  };
};
