import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Button,
  Card,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Loader,
  TextTag,
} from '@blms/ui';

import { useGreater } from '#src/hooks/use-greater.js';
import { useNavigateMisc } from '#src/hooks/use-navigate-misc.ts';
import { BackLink } from '#src/molecules/backlink.js';
import { assetUrl } from '#src/utils/index.js';
import { formatNameForURL } from '#src/utils/string.ts';
import { trpc } from '#src/utils/trpc.js';

import { ResourceLayout } from '../-components/resource-layout.tsx';

export const Route = createFileRoute(
  '/_content/resources/newsletters/$newsletterName-$newsletterId',
)({
  params: {
    parse: (params) => {
      const newsletterNameId = params['newsletterName-$newsletterId'];
      const newsletterId = newsletterNameId.split('-').pop();
      const newsletterName = newsletterNameId.slice(
        0,
        Math.max(0, newsletterNameId.lastIndexOf('-')),
      );

      return {
        'newsletterName-$newsletterId': `${newsletterName}-${newsletterId}`,
        newsletterName: z.string().parse(newsletterName),
        newsletterId: z.number().int().parse(Number(newsletterId)),
      };
    },
    stringify: ({ newsletterName, newsletterId }) => ({
      'newsletterName-$newsletterId': `${newsletterName}-${newsletterId}`,
    }),
  },
  component: NewsletterDetail,
});

function NewsletterDetail() {
  const navigate = useNavigate();
  const { navigateTo404 } = useNavigateMisc();

  const { t, i18n } = useTranslation();
  const params = Route.useParams();
  const isScreenMd = useGreater('sm');

  const { data: newsletter, isFetched } = trpc.content.getNewsletter.useQuery({
    id: Number(params.newsletterId),
    language: i18n.language ?? 'en',
  });

  const { data: newsletters } = trpc.content.getNewsletters.useQuery(
    {
      language: i18n.language,
    },
    {
      staleTime: 300_000, // 5 minutes
    },
  );

  useEffect(() => {
    if (
      newsletter &&
      params.newsletterName !== formatNameForURL(newsletter.title)
    ) {
      navigate({
        to: `/resources/newsletters/${formatNameForURL(newsletter.title)}-${
          newsletter.resourceId
        }`,
      });
    }
  }, [newsletter, isFetched, navigateTo404, params.newsletterName, navigate]);

  if (!newsletter) {
    return (
      <ResourceLayout
        title={t('newsletter.notFoundTitle')}
        tagLine={t('newsletter.notFoundSubtitle')}
        link={'/resources/newsletters'}
        activeCategory="newsletter"
        showPageHeader={false}
        backToCategoryButton
      >
        {!isFetched && <Loader size={'s'} />}
        <div className="text-white text-center">
          {t('underConstruction.itemNotFoundOrTranslated', {
            item: t('words.newsletter'),
          })}
        </div>
      </ResourceLayout>
    );
  }

  return (
    <ResourceLayout
      title={t('resources.newsletter.title')}
      tagLine={newsletter.author}
      link={'/resources/newsletters'}
      activeCategory="newsletters"
      showPageHeader={false}
      backToCategoryButton
      showResourcesDropdownMenu={false}
    >
      <div className="flex flex-col">
        <BackLink
          to={'/resources/newsletters'}
          label={t('resources.newsletters.title')}
        />
        <article className="w-full">
          <Card
            className="md:mx-auto !rounded-[10px] md:!rounded-[20px]"
            color="orange"
            withPadding={false}
            paddingClass="p-5 md:p-[30px]"
          >
            <article className="w-full flex flex-col md:flex-row gap-5 lg:gap-9">
              <div className="flex flex-col items-center justify-center">
                <img
                  className="md:w-[367px] mx-auto object-cover rounded-[10px] lg:max-w-[347px] md:mx-0 lg:rounded-[22px] mb-8 lg:mb-12"
                  alt={newsletter.title}
                  src={assetUrl(newsletter.path, 'thumbnail.webp')}
                />
                <div className="flex flex-row justify-evenly md:flex-col md:space-y-2 lg:flex-row lg:space-y-0">
                  {newsletter?.websiteUrl && (
                    <Link to={newsletter.websiteUrl}>
                      <Button
                        size={isScreenMd ? 'l' : 'm'}
                        variant="primary"
                        className="mx-2"
                      >
                        {t('resources.newsletter.discover')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="w-full max-w-2xl mt-4 flex flex-col md:mt-0">
                <h2 className="title-large-24px md:display-large-med-48px text-white mb-5 lg:mb-8">
                  {newsletter.title}
                </h2>
                <div className="flex flex-wrap gap-[10px] mb-5 lg:mb-8">
                  {newsletter.tags.map((tag, i) => (
                    <TextTag key={i} size="resourcesNewSize" variant="newGray">
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </TextTag>
                  ))}
                </div>
                <div className="flex items-center">
                  <span className="text-white body-14px-medium md:label-medium-med-16px pr-1">
                    {t('words.writtenByPodcasts')}
                  </span>
                  <h5 className="text-white body-14px md:body-16px ">
                    {newsletter.author}
                  </h5>
                </div>

                <p className="text-white mt-4">{newsletter.description}</p>
              </div>
            </article>
          </Card>
        </article>
      </div>

      <section className="mt-8 lg:mt-[100px]">
        <h3 className="label-medium-med-16px md:title-large-24px font-medium leading-none md:leading-[116%] text-white mb-5 md:mb-10">
          {t('resources.newsletters.subtitle')}
        </h3>
        <Carousel>
          <CarouselContent className="max-w-[240px]">
            {newsletters
              ?.filter((item) => item.resourceId !== newsletter.resourceId)
              .map((item) => (
                <CarouselItem key={item.resourceId}>
                  <Link
                    to={`/resources/newsletters/${formatNameForURL(item.title)}-${item.resourceId}`}
                  >
                    <div className="relative h-full">
                      <img
                        className="max-h-72 sm:max-h-96 size-full object-cover rounded-[10px]"
                        alt={item.title}
                        src={assetUrl(newsletter.path, 'thumbnail.webp')}
                      />
                      <div
                        className="absolute inset-0 -bottom-px rounded-[10px]"
                        style={{
                          background: `linear-gradient(360deg, rgba(40, 33, 33, 0.90) 10%, rgba(0, 0, 0, 0.00) 60%),
                        linear-gradient(0deg, rgba(57, 53, 49, 0.20) 0%, rgba(57, 53, 49, 0.20) 100%)`,
                          backgroundSize: '153.647% 100%',
                          backgroundPosition: '-5.216px 0px',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    </div>
                    <h3 className="absolute text-white px-2 lg:px-4 body-14px lg:title-large-24px mb-1 lg:mb-5 bottom-px line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </ResourceLayout>
  );
}
