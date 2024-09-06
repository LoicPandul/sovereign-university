import { times } from 'lodash-es';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '@blms/ui';

import arrowForward from '#src/assets/icons/arrow_forward.svg';
import stylusCircle from '#src/assets/icons/stylus_circle.svg';
import blueEllipse from '#src/assets/resources/blue-ellipse.svg';
import { Contributor } from '#src/components/contributor.js';
import { TooltipWithContent } from '#src/components/tooptip-with-content.js';
import { compose } from '#src/utils/index.js';

interface BookSummaryProps {
  contributor?: {
    username: string;
    title?: string;
    image?: string;
  };
  content?: string;
  title: string;
}

export const BookSummary = ({
  contributor,
  content,
  title,
}: BookSummaryProps) => {
  const { t } = useTranslation();
  const [isExtended, setIsExtended] = useState(false);

  return (
    <div className="flex flex-col">
      <h4 className="mb-8 ml-4 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
        {t('book.bookSummary.title')}
      </h4>
      <Card
        className={compose('px-6 pb-2 relative', isExtended ? '' : 'max-h-52')}
      >
        {/* remove max h if not needed here */}
        <div className={isExtended ? '' : 'max-h-36 overflow-hidden'}>
          <header className="flex flex-row justify-between">
            <div>
              <h5 className="mt-2 font-semibold">{title}</h5>
            </div>
          </header>

          <p className="mb-4 mt-8 text-justify text-xs">
            {content ? content : t('book.bookSummary.noSummary')}
          </p>

          {contributor && (
            <div className="float-right">
              <Contributor
                prefix={t('book.offeredBy')}
                contributor={contributor}
              />
            </div>
          )}
        </div>
      </Card>
      {isExtended ? (
        <p className="flex self-end whitespace-nowrap text-xs font-light italic text-blue-200 md:mr-8 lg:mr-10">
          {t('book.bookSummary.notice')}
        </p>
      ) : (
        <div className="flex w-full -translate-y-7 flex-row items-center justify-between px-14">
          <div className="flex gap-1">
            {times(3, (i) => (
              <img
                key={i}
                className="w-4"
                src={blueEllipse}
                alt={t('imagesAlt.blueEllipse')}
              />
            ))}
          </div>
          <div className="flex flex-row gap-2">
            {contributor ? (
              <button onClick={() => setIsExtended(true)}>
                <img alt={t('imagesAlt.forwardArrow')} src={arrowForward} />
              </button>
            ) : (
              <TooltipWithContent
                text={t('book.bookSummary.modifyTooltip')}
                position="top"
              >
                <button
                  onClick={() => {
                    window.open(
                      'https://github.com/PlanB-Network/bitcoin-educational-content',
                      '_blank',
                      'noopener,noreferrer',
                    );
                  }}
                >
                  <img alt={t('imagesAlt.stylus')} src={stylusCircle} />
                </button>
              </TooltipWithContent>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
