import { Link, createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@blms/ui';

import Corporates from '#src/assets/about/corporates.webp';
import PlanBCircles from '#src/assets/about/planb_circles.webp';
import PpAjelex from '#src/assets/people/ajelex.webp';
import PpAsi0 from '#src/assets/people/asi0.webp';
import Ct01 from '#src/assets/people/contributors/01.webp';
import Ct02 from '#src/assets/people/contributors/02.webp';
import Ct03 from '#src/assets/people/contributors/03.webp';
import Ct04 from '#src/assets/people/contributors/04.webp';
import Ct05 from '#src/assets/people/contributors/05.webp';
import Ct06 from '#src/assets/people/contributors/06.webp';
import Ct07 from '#src/assets/people/contributors/07.webp';
import Ct08 from '#src/assets/people/contributors/08.webp';
import Ct09 from '#src/assets/people/contributors/09.webp';
import Ct10 from '#src/assets/people/contributors/10.webp';
import Ct11 from '#src/assets/people/contributors/11.webp';
import Ct12 from '#src/assets/people/contributors/12.webp';
import Ct13 from '#src/assets/people/contributors/13.webp';
import Ct14 from '#src/assets/people/contributors/14.webp';
import Ct15 from '#src/assets/people/contributors/15.webp';
import Ct16 from '#src/assets/people/contributors/16.webp';
import Ct17 from '#src/assets/people/contributors/17.webp';
import Ct18 from '#src/assets/people/contributors/18.webp';
import Ct19 from '#src/assets/people/contributors/19.webp';
import Ct20 from '#src/assets/people/contributors/20.webp';
import Ct21 from '#src/assets/people/contributors/21.webp';
import PpDavid from '#src/assets/people/david.webp';
import PpFanis from '#src/assets/people/fanis.webp';
import PpGiacomo from '#src/assets/people/giacomo.webp';
import PpGibson from '#src/assets/people/gibson.webp';
import PpJim from '#src/assets/people/jim.webp';
import PpLoic from '#src/assets/people/loic.webp';
import PpPierre from '#src/assets/people/pierre.webp';
import PpRogzy from '#src/assets/people/rogzy.webp';
import PpTheom from '#src/assets/people/theo_m.webp';
import PpTheop from '#src/assets/people/theo_p.webp';
import PpTodd from '#src/assets/people/todd.webp';
import { PageLayout } from '#src/components/page-layout.js';
import { AboutUs } from '#src/molecules/about-us.js';
import { Person } from '#src/molecules/person.js';

const Mission = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="col-span-1 self-start">
          <div>
            <h2 className="mt-12 text-3xl font-semibold uppercase text-orange-500">
              {t('about.missionTitle')}
            </h2>
            <p className="mt-2 text-gray-400">{t('about.missionContent1')}</p>
            <p className="mt-2 text-gray-400">{t('about.missionContent2')}</p>
          </div>
          <div>
            <h2 className="mt-12 text-3xl font-semibold uppercase text-orange-500">
              {t('about.commitmentTitle')}
            </h2>
            <p className="mt-2 whitespace-pre-line text-gray-400">
              {t('about.commitmentContent')}
            </p>
          </div>
          <div>
            <h2 className="mt-12 text-3xl font-semibold uppercase text-orange-500">
              {t('about.storyTitle')}
            </h2>
            <p className="mt-2 whitespace-pre-line text-gray-400">
              {t('about.storyContent')}{' '}
              <a
                className="inline"
                href="https://youtu.be/niKsUKrV4pU?si=0H9jLJBteDmlsOaH"
              >
                https://youtu.be/niKsUKrV4pU?si=0H9jLJBteDmlsOaH
              </a>
            </p>
          </div>
        </div>
        <div className="col-span-1 mt-32 hidden max-w-md lg:block">
          <img
            src={PlanBCircles}
            className="mt-4 w-full"
            alt={t('')}
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-12 w-full max-w-5xl self-center">
        <Link to={'/manifesto'}>
          <Button variant="primary" className="self-start" glowing={true}>
            Read our manifesto
          </Button>
        </Link>
      </div>
    </>
  );
};

const Corporate = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-20 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <h2 className="text-3xl font-semibold uppercase text-orange-500">
          {t('about.corporateTitle')}
        </h2>
        <p className="mt-2 text-gray-400">{t('about.corporateContent')}</p>
        <p className="mt-2">
          {t('about.coportateContact')}{' '}
          <a href="mailto:contact@planb.network">contact@planb.network</a>
        </p>
      </div>
      <div className="mx-auto px-16">
        <img
          src={Corporates}
          className="mt-4 w-full max-w-md"
          alt={t('')}
          loading="lazy"
        />
      </div>
    </div>
  );
};

const CoreTeam = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold uppercase text-orange-500">
            {t('about.coreTeamTitle')}
          </h2>
          <p className="mt-2 text-gray-400">{t('about.coreTeamContent')}</p>
        </div>
      </div>
      <div className="mt-6 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Person
            name="Giacomo"
            job={t('about.coreTeamGiacomoRole')}
            picture={PpGiacomo}
          />
          <Person
            name="Asi0"
            job={t('about.coreTeamAsioRole')}
            picture={PpAsi0}
          />
        </div>
        <div className="flex flex-col gap-6">
          <Person
            name="Rogzy"
            job={t('about.coreTeamRogzyRole')}
            picture={PpRogzy}
          />
          <Person
            name="Ajelex"
            job={t('about.coreTeamAjelexRole')}
            picture={PpAjelex}
          />
        </div>
      </div>
    </>
  );
};

const Professors = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-20 flex w-full max-w-5xl  gap-6">
      <div>
        <h2 className="text-3xl font-semibold uppercase text-orange-500">
          {t('words.professors')}
        </h2>
        <div className="mt-8 flex flex-wrap gap-4">
          <img
            className="w-24 rounded-lg"
            src={PpFanis}
            alt=""
            loading="lazy"
          />
          <img className="w-24 rounded-lg" src={PpJim} alt="" loading="lazy" />
          <img className="w-24 rounded-lg" src={PpLoic} alt="" loading="lazy" />
          <img
            className="w-24 rounded-lg"
            src={PpTheom}
            alt=""
            loading="lazy"
          />
          <img
            className="w-24 rounded-lg"
            src={PpDavid}
            alt=""
            loading="lazy"
          />
          <img
            className="w-24 rounded-lg"
            src={PpPierre}
            alt=""
            loading="lazy"
          />
          <img
            className="w-24 rounded-lg"
            src={PpGibson}
            alt=""
            loading="lazy"
          />
          <img
            className="w-24 rounded-lg"
            src={PpTheop}
            alt=""
            loading="lazy"
          />
          <img className="w-24 rounded-lg" src={PpTodd} alt="" loading="lazy" />
        </div>
      </div>
    </div>
  );
};

const ActiveContributors = () => {
  const { t } = useTranslation();
  const css = 'w-24 h-24 rounded-full';

  return (
    <div className="mt-20 flex w-full max-w-5xl flex-col gap-4">
      <h2 className="text-3xl font-semibold uppercase text-orange-500">
        {t('about.activeContributors')}
      </h2>
      <div className="mt-8 flex w-full max-w-4xl flex-wrap justify-center gap-4 place-self-center">
        <img className={css} src={Ct01} alt="" loading="lazy" />
        <img className={css} src={Ct02} alt="" loading="lazy" />
        <img className={css} src={Ct03} alt="" loading="lazy" />
        <img className={css} src={Ct04} alt="" loading="lazy" />
        <img className={css} src={Ct05} alt="" loading="lazy" />
        <img className={css} src={Ct06} alt="" loading="lazy" />
        <img className={css} src={Ct07} alt="" loading="lazy" />
        <img className={css} src={Ct08} alt="" loading="lazy" />
        <img className={css} src={Ct09} alt="" loading="lazy" />
        <img className={css} src={Ct10} alt="" loading="lazy" />
        <img className={css} src={Ct11} alt="" loading="lazy" />
        <img className={css} src={Ct12} alt="" loading="lazy" />
        <img className={css} src={Ct13} alt="" loading="lazy" />
        <img className={css} src={Ct14} alt="" loading="lazy" />
        <img className={css} src={Ct15} alt="" loading="lazy" />
        <img className={css} src={Ct16} alt="" loading="lazy" />
        <img className={css} src={Ct17} alt="" loading="lazy" />
        <img className={css} src={Ct18} alt="" loading="lazy" />
        <img className={css} src={Ct19} alt="" loading="lazy" />
        <img className={css} src={Ct20} alt="" loading="lazy" />
        <img className={css} src={Ct21} alt="" loading="lazy" />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_content/_misc/about')({
  component: About,
});

function About() {
  const { t } = useTranslation();

  return (
    <PageLayout
      title={t('about.title')}
      subtitle={t('about.subtitle')}
      description={t('about.description')}
    >
      <div className="flex flex-col items-center px-4">
        <Mission />
        <div className="mt-12 max-w-[70rem]">
          <AboutUs />
        </div>
        <Corporate />
        <CoreTeam />
        <Professors />
        <ActiveContributors />
      </div>
    </PageLayout>
  );
}
