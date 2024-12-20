import { t } from 'i18next';
import { Trans } from 'react-i18next';

import SuccessParty from '#src/assets/icons/success_party.svg?react';

interface ExamSucceededProps {
  score: number;
}

export const ExamSucceeded = ({ score }: ExamSucceededProps) => {
  return (
    <div className="flex flex-col items-center">
      <SuccessParty className="size-7 md:size-20 fill-brightGreen-5" />
      <p className="text-newBlack-1 text-center mt-9">
        <Trans i18nKey={'courses.exam.congratulationsPassed'}>
          <span className="font-semibold">{'failed'}</span>
        </Trans>
      </p>

      <span className=" text-newBlack-1 mt-6">
        {t('courses.exam.score')}{' '}
        <span className={'text-brightGreen-5 font-semibold'}>{score}%</span>
      </span>
    </div>
  );
};
