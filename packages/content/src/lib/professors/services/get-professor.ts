import { firstRow } from '@sovereign-university/database';

import type { Dependencies } from '../../dependencies.js';
import {
  getProfessorCoursesQuery,
  getProfessorQuery,
  getProfessorTutorialsQuery,
  getProfessorsQuery,
} from '../queries/index.js';

import { formatProfessor } from './utils.js';

export const createGetProfessor =
  (dependencies: Dependencies) => async (id: number, language?: string) => {
    const { postgres } = dependencies;

    const professor = await postgres
      .exec(getProfessorQuery(id, language))
      .then(firstRow);

    if (!professor) return;

    const courses = await postgres.exec(
      getProfessorCoursesQuery({
        contributorId: professor.contributor_id,
        language,
      }),
    );

    const professors = await postgres
      .exec(
        getProfessorsQuery({
          contributorIds: courses.flatMap((course) => course.professors),
          language,
        }),
      )
      .then((professors) =>
        professors.map((element) => formatProfessor(element)),
      );

    const tutorials = await postgres.exec(
      getProfessorTutorialsQuery({
        contributorId: professor.contributor_id,
        language,
      }),
    );

    return {
      ...formatProfessor(professor),
      courses: courses.map((course) => ({
        ...course,
        professors: professors.filter((professor) =>
          course.professors.includes(professor.contributor_id),
        ),
      })),
      tutorials,
    };
  };
