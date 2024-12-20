import { Link } from '@tanstack/react-router';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Button } from '@blms/ui';

import FaceFailed from '#src/assets/icons/face_failed.svg';

interface ExamFailedProps {
  score: number;
  chapterId: string | undefined;
  courseId: string | undefined;
}

export const ExamFailed = ({ score, chapterId, courseId }: ExamFailedProps) => {
  return (
    <div className="flex flex-col items-center">
      <img src={FaceFailed} alt={'Face failed'} className="size-7 md:size-20" />
      <p className="text-newBlack-1 text-center mt-9">
        <Trans i18nKey={'courses.exam.oopsFailed'}>
          <span className="font-semibold">{'failed'}</span>
        </Trans>
      </p>

      <span className=" text-newBlack-1 mt-6">
        {t('courses.exam.score')}{' '}
        <span className={'text-red-5 font-semibold'}>{score}%</span>
      </span>
      <Link to="/courses/$courseId/$chapterId" params={{ courseId, chapterId }}>
        <Button className="mt-6">{t('courses.exam.tryAgain')}</Button>
      </Link>

      <p className="text-newBlack-1 text-center mt-4">
        {t('courses.exam.wishTryAgain')}
      </p>
    </div>
  );
};
