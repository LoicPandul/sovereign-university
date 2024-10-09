import { AiOutlineWarning } from 'react-icons/ai';

import { cn } from '@blms/ui';

interface PaymentCalloutProps {
  description: React.ReactNode;
}

const borderClassName = 'border border-gray-400/25 rounded-xl overflow-hidden';

export const PaymentCallout = ({ description }: PaymentCalloutProps) => {
  return (
    <div
      className={cn(
        'flex flex-row gap-2 lg:gap-6 items-center w-full rounded-2xl px-4 py-2',
        borderClassName,
      )}
    >
      <AiOutlineWarning className="size-6" />
      <span className="text-sm lg:text-base flex-1 lg:text-center ml-0.5">
        {description}
      </span>
    </div>
  );
};
