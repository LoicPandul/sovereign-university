import type { FormattedProfessor } from '@blms/types';
import { TextTag, cn } from '@blms/ui';

import { ProfessorCardReduced, SocialLinks } from './professor-card.tsx';

interface AuthorCardProps extends React.HTMLProps<HTMLDivElement> {
  professor: FormattedProfessor;
  centeredContent?: boolean;
  hasDonateButton?: boolean;
  mobileSize?: 'small' | 'medium';
}
{
  /* eslint-disable tailwindcss/no-contradicting-classname */
}

export const AuthorCard = ({
  professor,
  hasDonateButton,
  centeredContent = true,
  mobileSize = 'small',
  ...props
}: AuthorCardProps) => {
  return (
    <article {...props} className="flex flex-col w-full">
      <div className="mt-5 md:mt-6 flex max-md:flex-col gap-5 md:gap-7 md:py-5">
        <ProfessorCardReduced
          professor={professor}
          hasDonateButton={hasDonateButton}
          mobileSize={mobileSize}
        />

        <div
          className={cn(
            'flex flex-col md:items-start',
            centeredContent && 'items-center',
          )}
        >
          <p className="body-16px text-newBlack-1 md:max-w-[596px] w-full text-justify">
            {professor.bio}
          </p>
          <div className="mt-5 md:mt-4 flex flex-wrap gap-2.5 items-center">
            {professor.tags?.map((tag) => <TextTag key={tag}>{tag}</TextTag>)}
          </div>
          <div className="mt-1 w-fit">
            <SocialLinks professor={professor} />
          </div>
        </div>
      </div>
    </article>
  );
};
