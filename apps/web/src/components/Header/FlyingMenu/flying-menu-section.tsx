import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { Popover, PopoverContent, PopoverTrigger, cn } from '@blms/ui';

import { assetUrl } from '#src/utils/index.ts';
import { trpc } from '#src/utils/trpc.ts';

import { MenuElement } from '../menu-elements.tsx';
import type { NavigationSection } from '../props.ts';

import { FlyingMenuSubSection } from './flying-menu-sub-section.tsx';

export interface FlyingMenuProps {
  section: NavigationSection;
  variant?: 'dark' | 'light';
}

interface SectionTitleProps {
  section: NavigationSection;
  variant?: 'dark' | 'light';
  addArrow?: boolean;
  isOpen?: boolean;
}

const SectionTitle = ({
  section,
  variant = 'dark',
  addArrow,
  isOpen,
}: SectionTitleProps) => {
  const variantMap = {
    light: 'text-darkOrange-10',
    dark: 'text-white',
  };

  if ('path' in section) {
    return (
      <Link
        className={cn(
          'text-base font-medium leading-[144%] flex items-center gap-1.5',
          variantMap[variant],
        )}
        to={section.path as '/'}
      >
        {section.title}
        {addArrow && (
          <MdKeyboardArrowDown
            size={24}
            className={cn(
              'transition-transform ease-in-out',
              isOpen && '-rotate-180',
            )}
          />
        )}
      </Link>
    );
  }

  if ('action' in section) {
    return (
      <button
        className="inline-flex cursor-pointer items-center gap-x-1 text-base font-semibold leading-6 lg:text-lg"
        onClick={() => {
          section.action();
        }}
      >
        {section.title}
      </button>
    );
  }
};

export const FlyingMenuSection = ({ section, variant }: FlyingMenuProps) => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const { data: highlightedCourse } = trpc.content.getCourse.useQuery(
    {
      language: i18n.language ?? 'en',
      id: 'btc101',
    },
    {
      staleTime: 300_000, // 5 minutes
    },
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  if (!('items' in section)) {
    return (
      <div
        className={cn(
          'relative px-2 xl:px-4 py-1.5 rounded-lg hover:bg-white/20',
          open && 'bg-white/20',
        )}
      >
        <SectionTitle section={section} variant={variant} />
      </div>
    );
  }

  const hasMultipleSubSection = section.items.length > 1;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'relative px-2 xl:px-4 py-1.5 rounded-lg hover:bg-white/20',
            open && 'bg-white/20',
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <SectionTitle
            section={section}
            variant={variant}
            addArrow
            isOpen={open}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'flex absolute z-10 mt-8 -left-16',
          hasMultipleSubSection ? '-left-40 xl:-left-72' : '',
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={cn(
            'flex-auto overflow-hidden rounded-[20px]',
            variant === 'light' ? 'bg-darkOrange-4' : 'bg-newBlack-3',
          )}
        >
          <div className="flex flex-row items-center gap-4 my-5 mx-4">
            {section.id === 'courses' && highlightedCourse && (
              <Link
                to={`/courses/${highlightedCourse.id}`}
                className="w-[253px] mr-2  relative hover:border bg-tertiary-10 border-darkOrange-5 hover:shadow-sm-section rounded-md overflow-hidden"
              >
                <span className="absolute uppercase bg-white border border-white text-black body-semibold-12px rounded-br-[8px] py-[5px] px-2.5 z-10">
                  {t('words.startHere')}
                </span>
                <article className="w-full px-3 py-2 flex flex-col">
                  <img
                    src={assetUrl(
                      `courses/${highlightedCourse.id}`,
                      'thumbnail.webp',
                    )}
                    alt={highlightedCourse.name}
                    className="rounded-md mb-1 object-cover [overflow-clip-margin:_unset] object-center w-full"
                  />
                  <span className="text-white font-medium leading-normal tracking-015px overflow-hidden text-ellipsis line-clamp-1">
                    {highlightedCourse.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-tertiary-8 text-white rounded-sm p-1 text-xs leading-none capitalize">
                      {t(`words.level.${highlightedCourse.level}`)}
                    </span>
                    <span className="bg-tertiary-8 text-white rounded-sm p-1 text-xs leading-none uppercase">
                      {highlightedCourse.requiresPayment
                        ? t('courses.details.paidCourse')
                        : t('words.free')}
                    </span>
                  </div>
                </article>
              </Link>
            )}
            {'items' in section &&
              section.items.map((subSectionOrElement) => {
                return 'items' in subSectionOrElement ? (
                  <FlyingMenuSubSection
                    key={subSectionOrElement.id}
                    subSection={subSectionOrElement}
                    variant={variant}
                    hasMultipleSubSection={hasMultipleSubSection}
                  />
                ) : (
                  <div className="mx-2 my-4" key={subSectionOrElement.id}>
                    <MenuElement
                      element={subSectionOrElement}
                      variant={variant}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
