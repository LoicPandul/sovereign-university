import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { cn } from '@blms/ui';

import { RESOURCES_CATEGORIES } from '#src/services/utils.js';
import { capitalizeFirstWord } from '#src/utils/string.js';

interface CategoryTabsProps {
  resourceActiveCategory?: string;
}

export const CategoryTabs = ({ resourceActiveCategory }: CategoryTabsProps) => {
  const { t } = useTranslation();

  return (
    <nav className="md:flex flex-wrap w-full justify-center items-center md:gap-6 lg:gap-8 xl:gap-10 md:px-5 mb-14 hidden">
      {RESOURCES_CATEGORIES.map((resourceCategory) => {
        const categoryTitle = capitalizeFirstWord(
          t(`resources.${resourceCategory.name}.title`),
        );
        const isSingleWord = categoryTitle.split(' ').length === 1;

        return (
          <Link
            key={resourceCategory.name}
            to={`/resources/${resourceCategory.name}`}
            onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
              resourceCategory.unreleased && event.preventDefault()
            }
            className={cn(
              'group relative',
              resourceCategory.unreleased
                ? 'cursor-not-allowed opacity-50'
                : resourceCategory.name === resourceActiveCategory
                  ? 'scale-125 filter-newOrange1'
                  : '',
            )}
          >
            <div className="flex justify-center items-center p-2 lg:p-2.5 border border-white rounded-xl">
              <img
                src={resourceCategory.image}
                alt={resourceCategory.name}
                className="filter-white max-w-[25px]"
              />
            </div>
            <span
              className={cn(
                'absolute md:-left-6 xl:-left-7 right-0 text-center body-14px mx-auto text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 w-[100px]',
                resourceCategory.unreleased ? 'pointer-events-none' : '',
                isSingleWord ? '-bottom-6' : '-bottom-11',
              )}
            >
              {categoryTitle}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
