import { cn } from '@sovereign-university/ui';

interface CategoryIconProps {
  src: string;
  className?: string;
  variant?: 'resources';
}

export const CategoryIcon = ({
  src,
  className,
  variant,
}: CategoryIconProps) => {
  if (variant === 'resources') {
    return (
      <div
        className={cn(
          'relative flex size-[30px] shrink-0 md:size-[45px]',
          className,
        )}
      >
        <img
          className="absolute inset-0 m-auto h-full max-md:filter-white max-md:group-hover:filter-newOrange1"
          src={src}
          alt=""
        />
      </div>
    );
  }

  return (
    <div className={cn('relative flex size-12 shrink-0 md:size-20', className)}>
      <img className="absolute inset-0 m-auto h-8 md:h-14" src={src} alt="" />
    </div>
  );
};
