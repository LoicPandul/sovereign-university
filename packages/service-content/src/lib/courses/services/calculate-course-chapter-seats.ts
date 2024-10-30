import type { Dependencies } from '../../dependencies.js';
import { calculateCourseChapterSeats } from '../queries/calculate-course-chapter-seats.js';

export const createCalculateCourseChapterSeats = ({
  postgres,
}: Dependencies) => {
  return (): Promise<void> => {
    return postgres.exec(calculateCourseChapterSeats()).then(() => void 0);
  };
};
