import { Link, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { cn } from '@blms/ui';

export const MenuItem = ({
  text,
  icon,
  active,
  onClick,
  dropdown,
  showOnMobileOnly,
}: {
  text: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  dropdown?: Array<{ text: string; to: string; onClick?: () => void }>;
  showOnMobileOnly?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const location = useLocation();

  return (
    <button className={cn('w-full', showOnMobileOnly && 'lg:hidden')}>
      <button
        onClick={dropdown ? () => setIsOpen(!isOpen) : onClick}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            dropdown ? setIsOpen(!isOpen) : onClick?.();
          }
        }}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 p-2 justify-start rounded-md',
          active && 'bg-darkOrange-9 text-white font-medium',
          'lg:hover:bg-darkOrange-9 lg:hover:text-white lg:hover:font-medium',
        )}
      >
        <div className="shrink-0">{icon}</div>
        <span className="leading-normal text-lg font-medium lg:text-[15px] lg:font-normal lg:leading-relaxed truncate">
          {text}
        </span>
        {dropdown && (
          <MdKeyboardArrowDown
            size={24}
            className={cn(
              'ml-auto transition-transform ease-in-out shrink-0',
              isOpen ? '-rotate-180' : 'rotate-0',
            )}
          />
        )}
      </button>
      {dropdown && dropdown.length > 0 && isOpen && (
        <div className="flex flex-col w-full pl-8 gap-1 pt-1">
          {dropdown.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={cn(
                'text-left body-16px text-white px-2 py-1 lg:hover:bg-darkOrange-9 lg:hover:text-white lg:hover:font-medium w-full rounded-sm truncate',
                location.pathname.includes(item.to) &&
                  'bg-darkOrange-9 font-medium',
              )}
              onClick={item.onClick}
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </button>
  );
};
