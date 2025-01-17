import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { FaArrowRightLong } from 'react-icons/fa6';
import { FiDownload, FiEdit } from 'react-icons/fi';
import { IoIosSearch } from 'react-icons/io';

import type { BetViewUrl } from '@blms/types';
import { Button, Loader, cn } from '@blms/ui';

import { useGreater } from '#src/hooks/use-greater.js';
import type { VerticalCardProps } from '#src/molecules/vertical-card.js';
import { VerticalCard } from '#src/molecules/vertical-card.js';
import { assetUrl, trpc } from '#src/utils/index.ts';

import { ResourceLayout } from '../-components/resource-layout.tsx';

export const Route = createFileRoute('/_content/resources/bet/')({
  component: BET,
});

const Section = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col">{children}</div>;
};

const SectionTitle = ({ children }: { children: string }) => {
  return (
    <h2 className="mobile-h3 max-md:text-darkOrange-5 md:desktop-h3 md:text-center mb-2">
      {children}
    </h2>
  );
};

const SectionDescription = ({ children }: { children: string }) => {
  return (
    <p className="max-md:hidden text-center mb-2 md:mb-12 desktop-body1">
      {children}
    </p>
  );
};

const SectionGrid = ({
  elements,
  cardColor,
}: {
  elements: Array<{
    name: string;
    builder: string;
    downloadUrl: string;
    viewurls: BetViewUrl[];
    logo: string;
  }>;
  cardColor: VerticalCardProps['cardColor'];
}) => {
  const { t, i18n } = useTranslation();

  const language = i18n.language;

  const isScreenMd = useGreater('md');

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {elements.map((item, index) => {
        const currentLanguageViewUrl =
          item.viewurls.find((el) => el.language === language)?.viewUrl ||
          item.viewurls[0]?.viewUrl;

        return (
          <VerticalCard
            key={item.name}
            title={item.name}
            subtitle={item.builder}
            imageSrc={item.logo}
            languages={[]}
            buttonLink={currentLanguageViewUrl}
            buttonText={t('words.view')}
            buttonIcon={<IoIosSearch size={isScreenMd ? 24 : 16} />}
            buttonVariant="transparent"
            buttonMode="dark"
            secondaryLink={item.viewurls[0]?.viewUrl}
            secondaryButtonText={t('words.edit')}
            secondaryButtonIcon={<FiEdit size={isScreenMd ? 24 : 16} />}
            secondaryButtonVariant="secondary"
            secondaryButtonMode="dark"
            tertiaryLink={item.downloadUrl}
            tertiaryButtonIcon={<FiDownload size={isScreenMd ? 24 : 16} />}
            tertiaryButtonVariant="outlineWhite"
            tertiaryButtonMode="dark"
            externalLink
            onHoverArrow={false}
            cardColor={cardColor}
            onHoverCardColorChange
            className="max-w-[137px] md:max-w-80"
          />
        );
      })}
    </div>
  );
};

function BET() {
  const { t, i18n } = useTranslation();

  const { data: bets, isFetched } = trpc.content.getBets.useQuery(
    {
      language: i18n.language ?? 'en',
    },
    {
      staleTime: 300_000, // 5 minutes
    },
  );

  return (
    <ResourceLayout
      title={t('bet.pageTitle')}
      activeCategory="bet"
      marginTopChildren={false}
      maxWidth="1360"
      hidePageHeaderMobile
    >
      <div className="flex flex-col text-newGray-5 mt-8">
        <p className="max-w-4xl mx-auto text-center mobile-subtitle2 md:desktop-h7 max-md:mb-6">
          {t('bet.pageDescription')}
        </p>

        <div className="h-px max-w-6xl w-full bg-newGray-1 max-md:hidden my-16 mx-auto" />

        <div className="flex flex-col max-md:gap-7">
          {/* Section of Educational Content */}
          <Section>
            <SectionTitle>{t('bet.educationalContent.title')}</SectionTitle>
            <SectionDescription>
              {t('bet.educationalContent.description')}
            </SectionDescription>
            {!isFetched && <Loader size={'s'} />}
            <SectionGrid
              elements={
                bets
                  ?.filter((bet) => bet.type === 'educational content')
                  .map((bet) => {
                    return {
                      name: bet.name,
                      builder: bet.builder || '',
                      downloadUrl: bet.downloadUrl,
                      viewurls: bet.viewurls,
                      logo: assetUrl(bet.path, 'logo.webp'),
                    };
                  }) || []
              }
              cardColor="orange"
            />
          </Section>

          <div className="h-px max-w-6xl w-full bg-newGray-1 max-md:hidden my-16 mx-auto" />

          {/* Section of Visual Content */}
          <Section>
            <SectionTitle>{t('bet.visualContent.title')}</SectionTitle>
            <SectionDescription>
              {t('bet.visualContent.description')}
            </SectionDescription>
            {!isFetched && <Loader size={'s'} />}
            <SectionGrid
              elements={
                bets
                  ?.filter((bet) => bet.type === 'visual content')
                  .map((bet) => {
                    return {
                      name: bet.name,
                      builder: bet.builder || '',
                      downloadUrl: bet.downloadUrl,
                      viewurls: bet.viewurls,
                      logo: assetUrl(bet.path, 'logo.webp'),
                    };
                  }) || []
              }
              cardColor="maroon"
            />
          </Section>
        </div>

        <div className="h-px max-w-6xl w-full bg-newGray-1 max-md:hidden my-16 mx-auto" />

        <div className="max-md:mt-7 w-full max-w-4xl mx-auto border border-newBlack-5 rounded-[1.25rem] px-2.5 py-4 md:p-5">
          <h3 className="desktop-h6 max-md:text-darkOrange-5 text-[40px] font-normal leading-tight tracking-[0.25px] max-md:text-center mb-2.5">
            {t('bet.contributeTitle')}
          </h3>
          <div className="flex items-center justify-center max-md:flex-col md:gap-10">
            <p className="max-md:text-center desktop-typo1 md:text-xl md:leading-snug max-md:mb-2.5 md:max-w-[541px]">
              {t('bet.contributeDescription')}
            </p>
            <a
              href="https://github.com/PlanB-Network/bitcoin-educational-content"
              target="_blank"
              className="max-md:mx-auto md:ml-auto shrink-0"
              rel="noreferrer"
            >
              <Button variant="primary" size="l">
                {t('bet.contributeButton')}{' '}
                <FaArrowRightLong
                  className={cn(
                    'opacity-0 max-w-0 inline-flex whitespace-nowrap transition-[max-width_opacity] overflow-hidden ease-in-out duration-150 group-hover:max-w-96 group-hover:opacity-100',
                    'group-hover:ml-3',
                  )}
                />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </ResourceLayout>
  );
}
