import { BsPlay, BsSkipEnd, BsSkipStart } from 'react-icons/bs';

import { Button } from '@blms/ui';

import { compose } from '#src/utils/index.js';

const commonClasses = 'bg-orange-400';

const buttonClasses = compose(
  commonClasses,
  'hover:bg-orange-500 duration-200',
);

const iconClasses = 'w-8 h-8';

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onBack?: () => void;
  onSkipBack?: () => void;
  onNext?: () => void;
  onSkipNext?: () => void;
}

export const Pagination = ({
  currentPage = 0,
  totalPages = 0,
  onBack,
  onSkipBack,
  onNext,
  onSkipNext,
}: PaginationProps) => {
  return (
    <div className="flex flex-row space-x-4">
      <Button
        variant="tertiary"
        className={buttonClasses}
        rounded
        icon={<BsSkipStart className={iconClasses} />}
        onClick={() => onSkipBack?.()}
      />
      <Button
        variant="tertiary"
        className={buttonClasses}
        rounded
        icon={<BsPlay className={compose(iconClasses, 'rotate-180')} />}
        onClick={() => onBack?.()}
      />
      <div
        className={compose(
          commonClasses,
          'flex flex-row justify-center items-center px-3 w-20 font-normal text-white rounded-full',
        )}
      >
        {currentPage} / {totalPages}
      </div>
      <Button
        variant="tertiary"
        className={buttonClasses}
        rounded
        icon={<BsPlay className={iconClasses} />}
        onClick={() => onNext?.()}
      />
      <Button
        variant="tertiary"
        className={buttonClasses}
        rounded
        icon={<BsSkipEnd className={iconClasses} />}
        onClick={() => onSkipNext?.()}
      />
    </div>
  );
};
