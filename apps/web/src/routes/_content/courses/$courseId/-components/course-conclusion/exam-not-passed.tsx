import { Link } from '@tanstack/react-router';

import { Button } from '@blms/ui';

interface ExamNotPassedProps {
  chapterId: string | undefined;
  courseId: string | undefined;
}

export const ExamNotPassed = ({ courseId, chapterId }: ExamNotPassedProps) => {
  return (
    <>
      <h1>EXAM NOT PASSED</h1>
      <Link to="/courses/$courseId/$chapterId" params={{ courseId, chapterId }}>
        <Button className="">Pass the exam</Button>
      </Link>
    </>
  );
};
