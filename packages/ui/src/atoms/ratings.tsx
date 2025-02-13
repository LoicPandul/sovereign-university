import React, { useState } from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';

import { cn } from '../lib/utils.js';

const ratingVariants = {
  default: {
    star: 'text-foreground',
    emptyStar: 'text-muted-foreground',
  },
  destructive: {
    star: 'text-destructive',
    emptyStar: 'text-destructive/70',
  },
  yellow: {
    star: 'text-darkOrange-5',
    emptyStar: 'text-newGray-2',
  },
  disabled: {
    star: 'text-newGray-1',
    emptyStar: 'text-newGray-2',
  },
};

export interface RatingsProps extends React.HTMLAttributes<HTMLDivElement> {
  totalStars?: number;
  size?: number;
  fill?: boolean;
  Icon?: React.ReactElement;
  FilledIcon?: React.ReactElement;
  variant?: keyof typeof ratingVariants;
  asInput?: boolean;
  value: number;
  onValueChange?: (value: number) => void;
}

const Ratings = ({ ...props }: RatingsProps) => {
  const {
    totalStars = 5,
    size = 30,
    fill = true,
    Icon = <BsStar />,
    FilledIcon = <BsStarFill />,
    variant = 'default',
    asInput = false,
    onValueChange,
    value,
  } = props;

  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const ratings = hoverValue === null ? value : hoverValue;

  const fullStars = Math.floor(ratings);
  const partialStar =
    ratings % 1 > 0 ? (
      <PartialStar
        fillPercentage={ratings % 1}
        size={size}
        className={cn(ratingVariants[variant].star)}
        Icon={Icon}
        asInput={asInput}
        onValueChange={() => onValueChange?.(fullStars + 1)}
      />
    ) : null;

  return (
    <div
      className={cn('flex items-center max-md:justify-between md:gap-5')}
      onMouseEnter={() => setHoverValue(value)}
      onMouseLeave={() => setHoverValue(null)}
      {...props}
    >
      {Array.from({ length: fullStars }).map((_, i) =>
        React.cloneElement(FilledIcon, {
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key: i,
          size,
          className: cn(
            fill ? 'fill-current' : 'fill-transparent',
            ratingVariants[variant].star,
            asInput ? 'cursor-pointer hover:fill-current' : '',
          ),
          role: props.asInput && 'input',
          onClick: () => onValueChange?.(i + 1),
          onMouseEnter: () => setHoverValue(i + 1),
        }),
      )}
      {partialStar}
      {Array.from({
        length: totalStars - fullStars - (partialStar ? 1 : 0),
      }).map((_, i) =>
        React.cloneElement(Icon, {
          key: i + fullStars + 1,
          size,
          className: cn(
            ratingVariants[variant].emptyStar,
            asInput ? 'cursor-pointer hover:fill-current' : '',
          ),
          role: props.asInput && 'input',
          onClick: () =>
            onValueChange?.(fullStars + i + 1 + (partialStar ? 1 : 0)),
          onMouseEnter: () => setHoverValue(fullStars + i + 1),
        }),
      )}
    </div>
  );
};

interface MyIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}
interface PartialStarProps {
  fillPercentage: number;
  size: number;
  className?: string;
  Icon: React.ReactElement<MyIconProps>;
  asInput?: boolean;
  onValueChange?: () => void;
}

const PartialStar = ({ ...props }: PartialStarProps) => {
  const { fillPercentage, size, className, Icon, asInput, onValueChange } =
    props;

  return (
    <div
      role={asInput ? 'input' : undefined}
      onClick={() => onValueChange?.()}
      onKeyDown={() => onValueChange?.()}
      className={cn('relative inline-block', asInput && 'cursor-pointer')}
    >
      {React.cloneElement(Icon, {
        size,
        className: cn('fill-transparent', className),
      })}
      <div
        style={{
          position: 'absolute',
          top: 0,
          overflow: 'hidden',
          width: `${fillPercentage * 100}%`,
        }}
      >
        {React.cloneElement(Icon, {
          size,
          className: cn('fill-current', className),
        })}
      </div>
    </div>
  );
};

export { Ratings };
