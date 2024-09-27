import type { FormattedProfessor } from '@blms/types';
import { TextTag } from '@blms/ui';

import { ProfessorCardReduced, SocialLinks } from './professor-card.tsx';

interface AuthorCardProps extends React.HTMLProps<HTMLDivElement> {
  professor: FormattedProfessor;
}
{
  /* eslint-disable tailwindcss/no-contradicting-classname */
}

export const AuthorCard = ({ professor, ...props }: AuthorCardProps) => {
  return (
    <article {...props} className="flex flex-col w-full">
      <div className="mt-5 md:mt-6 flex max-md:flex-col gap-6 md:gap-7 md:py-5">
        <ProfessorCardReduced professor={professor} />
        <div className="flex flex-col items-start">
          <p className="body-16px text-newBlack-1 md:max-w-[596px]">
            {professor.bio}
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5 items-center">
            {professor.tags?.map((tag) => <TextTag key={tag}>{tag}</TextTag>)}
          </div>

          <div>
            <SocialLinks professor={professor} />
          </div>
        </div>
      </div>
    </article>
  );
};
