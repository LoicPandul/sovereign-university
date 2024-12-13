import { Trans } from 'react-i18next';

import ThumbUp from '#src/assets/icons/thumb-up-pixelated.svg';

export const SuggestedHeader = ({
  text,
  placeholder,
}: {
  text: string;
  placeholder: string;
}) => {
  return (
    <div className="flex items-center justify-center md:justify-start mb-5 lg:mb-10">
      <img
        src={ThumbUp}
        className="size-[20px] lg:size-[32px] mr-3 my-1"
        alt=""
      />
      <h3 className="items-center title-small-med-16px md:title-large-24px font-medium text-white mt-1">
        <Trans i18nKey={text}>
          <span className="text-darkOrange-5">
            {placeholder}
            {''}
          </span>
        </Trans>
      </h3>
    </div>
  );
};
