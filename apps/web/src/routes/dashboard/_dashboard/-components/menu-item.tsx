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
}: {
  text: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  dropdown?: Array<{ text: string; to: string }>;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const location = useLocation();

  return (
    <button className="lg:w-full">
      <div
        onClick={dropdown ? () => setIsOpen(!isOpen) : onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            dropdown ? setIsOpen(!isOpen) : onClick?.();
          }
        }}
        className={cn(
          'flex w-full cursor-pointer flex-col lg:flex-row items-center justify-center gap-1 lg:gap-3 py-1 px-1.5 lg:p-2 lg:justify-start rounded-lg lg:rounded-md',
          active && 'bg-white/20 lg:bg-darkOrange-9 text-white font-medium',
          (!dropdown || !isOpen) &&
            'hover:bg-white/20 lg:hover:bg-darkOrange-9 hover:text-white hover:font-medium',
        )}
      >
        <div className="min-w-5">{icon}</div>
        <div className="max-lg:text-[10px] max-lg:text-white max-lg:leading-normal lg:leading-relaxed">
          {text}
        </div>
        {dropdown && (
          <MdKeyboardArrowDown
            size={24}
            className={cn(
              'ml-auto transition-transform ease-in-out shrink-0',
              isOpen ? '-rotate-180' : 'rotate-0',
            )}
          />
        )}
      </div>
      {dropdown && dropdown.length > 0 && isOpen && (
        <div className="flex flex-col w-full pl-9 gap-1 pt-1">
          {dropdown.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={cn(
                'text-left px-2 py-1 hover:bg-white/20 lg:hover:bg-darkOrange-9 hover:text-white hover:font-medium w-full rounded-sm',
                location.pathname.includes(item.to) &&
                  'bg-white/20 lg:bg-darkOrange-9 text-white font-medium',
              )}
            >
              {item.text}
            </Link>
          ))}
        </div>
      )}
    </button>
  );
};
