import type { JoinedCourseWithAll } from '@blms/types';

interface ConclusionFinishProps {
  course: JoinedCourseWithAll;
}

export const ConclusionFinish = ({ course }: ConclusionFinishProps) => {
  return (
    <>
      <h1>FINISH {course.name}</h1>
    </>
  );
};
