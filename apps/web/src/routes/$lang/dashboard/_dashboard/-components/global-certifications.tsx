import { Link, useNavigate } from '@tanstack/react-router';
import { t } from 'i18next';
import { capitalize } from 'lodash-es';
import React, { useContext, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { BsTwitterX } from 'react-icons/bs';
import { FiDownload, FiLoader } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { IoReload } from 'react-icons/io5';

import type { JoinedBCertificateResults, Ticket } from '@blms/types';
import { Button, Loader, cn } from '@blms/ui';

import DummyBCert from '#src/assets/about/dummy-bcert.webp';
import ApprovedIcon from '#src/assets/icons/approved.svg?react';
import SandClockGif from '#src/assets/icons/sandClock/sandclock.gif';
import { useSmaller } from '#src/hooks/use-smaller.ts';
import { ButtonWithArrow } from '#src/molecules/button-arrow.tsx';
import { AppContext } from '#src/providers/context.js';
import { formatDate, formatTime } from '#src/utils/date.ts';
import { trpc } from '#src/utils/trpc.js';

export const GlobalCertifications = () => {
  const navigate = useNavigate();

  const { session } = useContext(AppContext);

  const { data: exams } =
    trpc.user.bcertificate.getBCertificateResults.useQuery();

  const { data: examTickets } = trpc.user.billing.getExamTickets.useQuery();

  const [isExamOpen, setIsExamOpen] = useState<boolean[]>([]);
  const [isTicketOpen, setIsTicketOpen] = useState<boolean[]>([]);

  const handleExamOpen = (index: number) => {
    setIsExamOpen((v) => v.map((value, i) => (i === index ? !value : false)));
    setIsTicketOpen((v) => v.map(() => false));
  };

  useEffect(() => {
    const results = Array.from({ length: exams?.length ?? 0 }, () => false);
    if (results.length > 0 && (!examTickets || examTickets.length === 0)) {
      results[results.length - 1] = true;
    }
    setIsExamOpen(results);
  }, [examTickets, exams]);

  const handleTicketOpen = (index: number) => {
    setIsTicketOpen((v) => v.map((value, i) => (i === index ? !value : false)));
    setIsExamOpen((v) => v.map(() => false));
  };

  let isLastElementSelected = false;
  if (isTicketOpen.length > 0 && isTicketOpen.at(-1) === true) {
    isLastElementSelected = true;
  } else if (
    isTicketOpen.length === 0 &&
    isExamOpen.length > 0 &&
    isExamOpen.at(-1) === true
  ) {
    isLastElementSelected = true;
  }

  const hasOneElementOpen =
    isExamOpen.includes(true) || isTicketOpen.includes(true);

  useEffect(() => {
    const results = Array.from(
      { length: examTickets?.length ?? 0 },
      () => false,
    );
    if (results.length > 0) {
      results[results.length - 1] = true;
    }
    setIsTicketOpen(results);
  }, [examTickets, exams]);

  useEffect(() => {
    if (session === null) {
      navigate({ to: '/' });
    }
  }, [session]);

  if (!session) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-8 mt-10">
      <section className="flex flex-col">
        <h4 className="mobile-h3 md:desktop-h6 mb-4">
          {t('dashboard.credentials.bCertificate')}
        </h4>
        <p className="mobile-body2 md:desktop-body1 text-newBlack-4 whitespace-pre-line">
          {t('dashboard.credentials.bCertificateSubtitle')}
        </p>

        <div className="mt-10">
          <table className="overflow-scroll table-auto w-full max-w-5xl min-w-[400px] md:min-w-[600px]">
            <TableHead />
            <tbody>
              {exams &&
                exams.length > 0 &&
                exams.map((exam, index) => {
                  return (
                    <ExamResult
                      key={exam.id}
                      exam={exam}
                      handleExamOpen={handleExamOpen}
                      index={index}
                      isExamOpen={isExamOpen}
                    />
                  );
                })}

              {examTickets &&
                examTickets.length > 0 &&
                examTickets.map((examTicket, index) => {
                  return (
                    <ExamTicket
                      examTicket={examTicket}
                      key={examTicket.eventId}
                      index={index}
                      handleTicketOpen={handleTicketOpen}
                      isTicketOpen={isTicketOpen}
                    />
                  );
                })}

              {exams && exams.length === 0 && <NoResults />}
            </tbody>
            <TableFooter
              isLastElementSelected={isLastElementSelected}
              hasOneElementOpen={hasOneElementOpen}
            />
          </table>
        </div>
      </section>
    </div>
  );
};

const ExamResult = ({
  exam,
  index,
  handleExamOpen,
  isExamOpen,
}: {
  exam: JoinedBCertificateResults;
  index: number;
  handleExamOpen: (index: number) => void;
  isExamOpen: boolean[];
}) => {
  const hasPassed = exam.score !== undefined && exam.score >= exam.minScore;
  const examScore = exam.results.reduce(
    (total, result) => total + result.score,
    0,
  );
  const isMobile = useSmaller('md');

  function RetakeExam() {
    const examLink = '/b-certificate';

    return (
      <Link
        to={examLink}
        className="block md:float-right max-md:mx-auto m-4 w-fit"
      >
        <Button
          className="w-fit flex gap-2.5"
          size={isMobile ? 's' : 'm'}
          variant="primary"
        >
          {t('dashboard.credentials.retakeExam')}
          <IoReload size={isMobile ? 18 : 24} />
        </Button>
      </Link>
    );
  }

  return (
    <React.Fragment>
      <tr
        className={cn(
          'mobile-body2 md:desktop-body1 hover:font-medium',
          isExamOpen[index] ? 'bg-newGray-6' : '',
        )}
        onClick={() => handleExamOpen(index)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleExamOpen(index);
          }
        }}
        tabIndex={0}
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        role="button"
      >
        <td className="py-6 pr-1.5">{exam.date.toLocaleDateString()}</td>
        <td className="">{exam.location}</td>
        <td className="max-md:hidden">
          <div className="">{exam.id.slice(0, 8)}</div>
        </td>
        <td
          className={cn(
            'font-medium items-center h-full',
            hasPassed ? 'text-brightGreen-6' : 'text-red-5',
          )}
        >
          <span className="float-end">
            {(examScore * 100) / (exam.results.length * 20)}%
          </span>
        </td>
        <td
          className={cn(
            'italic pl-8 max-md:hidden',
            hasPassed ? 'text-brightGreen-6' : 'text-red-5',
          )}
        >
          {hasPassed ? t('words.passed') : t('words.failed')}
        </td>
        <td>
          <div>
            <IoIosArrowDown
              size={24}
              className={cn(
                'text-newGray-1 transition-transform',
                isExamOpen[index] && 'rotate-180',
              )}
            />
          </div>
        </td>
      </tr>
      {isExamOpen[index] && (
        <tr className="bg-newGray-6">
          {hasPassed ? (
            <>
              {isMobile ? (
                <>
                  <td colSpan={4} className="px-2">
                    <BcertDetails
                      exam={exam}
                      examScore={examScore}
                      examIndex={index}
                    />
                    <div className="text-newOrange-5 font-medium uppercase mt-8">
                      {t('dashboard.credentials.yourCertificate')}
                    </div>

                    <div>
                      {exam.imgKey && (
                        <img
                          src={`/api/files/${exam.imgKey}`}
                          alt="BCertificate"
                          className="mt-4 mx-auto"
                        />
                      )}
                    </div>
                    <div className="flex flex-col items-center mt-4 gap-4">
                      <a
                        href={`/api/files/zip/bcert/${exam.pdfKey?.split('/').slice(1, 3).join('/')}`}
                        download
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          size={'m'}
                          variant="primary"
                          className="items-center flex gap-2.5"
                        >
                          {t('bCertificate.download')}
                          <FiDownload className="size-[18px] md:size-6" />
                        </Button>
                      </a>

                      <div className="flex flex-row gap-4 items-center">
                        <span className="text-xs italic font-light text-black">
                          {t('dashboard.course.shareOnSocials')}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <Link
                            to={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                              t('bCertificate.tweetText', {
                                certificateUrl: `${window.location.origin}/en/bcert-certificates/${encodeURIComponent(exam.imgKey ? exam.imgKey.split('.').slice(0, 1).join('.') : '')}`,
                                score: `${exam.score}`,
                                emoji:
                                  exam.score && exam.score >= 90 ? '🏆' : '💪',
                              }),
                            )}`}
                            target="_blank"
                          >
                            <Button variant="tertiary" size="s">
                              <BsTwitterX size={18} />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <Link
                        to={
                          '/tutorials/others/other/pbn-certificate-timestamping-dd16f8c0-00c1-45fd-8792-920612bed18f'
                        }
                        target="_blank"
                        className="flex flex-row items-center gap-2 text-newBlack-5 hover:text-newOrange-5 hover:underline"
                      >
                        <ApprovedIcon className="size-4" />
                        <span>{t('bCertificate.verify')}</span>
                      </Link>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td />
                  <td colSpan={4} className="pr-32">
                    <BcertDetails
                      exam={exam}
                      examScore={examScore}
                      examIndex={index}
                    />
                    <div className="text-newOrange-5 font-medium uppercase mt-8">
                      {t('dashboard.credentials.yourCertificate')}
                    </div>

                    <div>
                      {exam.imgKey && (
                        <img
                          src={`/api/files/${exam.imgKey}`}
                          alt="BCertificate"
                          className="mt-4 md:mt-2.5"
                        />
                      )}
                    </div>
                    <div className="flex flex-row justify-between mt-4">
                      <a
                        href={`/api/files/zip/bcert/${exam.pdfKey?.split('/').slice(1, 3).join('/')}`}
                        download
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          size={isMobile ? 's' : 'm'}
                          variant="primary"
                          className="items-center flex gap-2.5"
                        >
                          {t('bCertificate.download')}
                          <FiDownload className="size-[18px] md:size-6" />
                        </Button>
                        <Link
                          to={
                            '/tutorials/others/other/pbn-certificate-timestamping-dd16f8c0-00c1-45fd-8792-920612bed18f'
                          }
                          target="_blank"
                          className="flex flex-row items-center mt-4 gap-2 text-newBlack-5 hover:text-newOrange-5 hover:underline"
                        >
                          <ApprovedIcon className="size-4" />
                          <span>{t('bCertificate.verify')}</span>
                        </Link>
                      </a>

                      <div className="flex items-center gap-4">
                        <span className="text-xs italic font-light text-black max-md:hidden">
                          {t('dashboard.course.shareOnSocials')}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <Link
                            to={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                              t('bCertificate.tweetText', {
                                certificateUrl: `${window.location.origin}/en/bcert-certificates/${encodeURIComponent(exam.imgKey ? exam.imgKey.split('.').slice(0, 1).join('.') : '')}`,
                                score: `${exam.score}`,
                                emoji:
                                  exam.score && exam.score >= 90 ? '🏆' : '💪',
                              }),
                            )}`}
                            target="_blank"
                          >
                            <Button variant="tertiary" size="s">
                              <BsTwitterX size={18} />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="h-6" />
                  </td>
                  <td colSpan={1} />
                </>
              )}
            </>
          ) : (
            <>
              {isMobile ? (
                <>
                  <td className="px-2" colSpan={4}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        className="h-fit max-md:hidden"
                        src={DummyBCert}
                        alt="Dummy b-cert"
                      />

                      <div className="w-full pr-4">
                        <BcertDetails
                          exam={exam}
                          examScore={examScore}
                          examIndex={index}
                        />
                      </div>
                    </div>
                    <RetakeExam />
                  </td>
                </>
              ) : (
                <>
                  <td className="pt-6" colSpan={6}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        className="h-fit max-md:hidden"
                        src={DummyBCert}
                        alt="Dummy b-cert"
                      />

                      <div className="w-full pr-4">
                        <BcertDetails
                          exam={exam}
                          examScore={examScore}
                          examIndex={index}
                        />
                      </div>
                    </div>
                    <RetakeExam />
                  </td>
                </>
              )}
            </>
          )}
        </tr>
      )}
    </React.Fragment>
  );
};

const ExamTicket = ({
  examTicket,
  index,
  handleTicketOpen,
  isTicketOpen,
}: {
  examTicket: Ticket;
  index: number;
  handleTicketOpen: (index: number) => void;
  isTicketOpen: boolean[];
}) => {
  const isMobile = useSmaller('md');

  const { mutateAsync: downloadTicketAsync, isPending } =
    trpc.user.events.downloadEventTicket.useMutation();
  const { user } = useContext(AppContext);

  function SeeTicket() {
    return (
      <ButtonWithArrow
        className="mt-6"
        onClick={async () => {
          const base64 = await downloadTicketAsync({
            eventId: examTicket.eventId,
            userName: user?.username as string,
          });
          const link = document.createElement('a');
          link.href = `data:application/pdf;base64,${base64}`;
          link.download = 'ticket.pdf';
          document.body.append(link);
          link.click();
          link.remove();
        }}
      >
        {t('dashboard.credentials.downloadTicket')}
        {isPending ? (
          <span className="ml-3">
            <FiLoader />
          </span>
        ) : null}
      </ButtonWithArrow>
    );
  }

  return (
    <>
      <tr
        className={cn(
          'mobile-body2 md:desktop-body1 hover:font-medium',
          isTicketOpen[index] ? 'bg-newGray-6' : '',
        )}
        onClick={() => handleTicketOpen(index)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTicketOpen(index);
          }
        }}
        tabIndex={0}
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        role="button"
      >
        <td>{examTicket.date.toLocaleDateString()}</td>
        <td>{examTicket.location}</td>
        <td className="max-md:hidden" />
        <td className="max-md:hidden" />
        <td className="italic pl-8">
          {examTicket.date.getTime() > Date.now() ? (
            <span>{t('words.booked')}</span>
          ) : (
            <span>{t('words.inReview')}</span>
          )}
        </td>
        <td>
          <div>
            <IoIosArrowDown
              size={24}
              className={cn(
                'text-newGray-1 transition-transform',
                isTicketOpen[index] && 'rotate-180',
              )}
            />
          </div>
        </td>
      </tr>
      {isTicketOpen[index] && (
        <tr className="bg-newGray-6">
          {isMobile ? (
            <>
              <td colSpan={4}>
                {examTicket.date.getTime() > Date.now() ? (
                  <div className="flex flex-col items-center desktop-body1 mt-4">
                    <p className="font-medium">
                      {t('dashboard.credentials.seatBooked')}
                    </p>
                    <span className="mt-6">
                      {t('dashboard.credentials.takePlaceAt')}
                    </span>
                    <span>{examTicket.addressLine1}</span>
                    <span>{examTicket.addressLine2}</span>
                    <span>{examTicket.addressLine3}</span>
                    <span>
                      {`${formatDate(examTicket.date)} at ${formatTime(examTicket.date, examTicket.timezone || 'UTC')} (${examTicket.timezone || 'UTC'})`}
                    </span>
                    <SeeTicket />
                    <img
                      className="mt-2 mx-auto"
                      src={DummyBCert}
                      alt="Dummy b-cert"
                    />
                  </div>
                ) : (
                  <>
                    <div className="items-center desktop-body1 flex flex-col justify-between py-[2px] w-fit">
                      <p className="font-medium text-center px-6">
                        {t('dashboard.credentials.beingGraded')}
                      </p>
                      <img
                        className="mt-4 h-10"
                        src={SandClockGif}
                        alt="Sandclock"
                      />
                      <img
                        className="mt-4"
                        src={DummyBCert}
                        alt="Dummy b-cert"
                      />
                    </div>
                  </>
                )}
              </td>
            </>
          ) : (
            <>
              <td className=" pt-6 pb-2" colSpan={2}>
                <img src={DummyBCert} alt="Dummy b-cert" />
              </td>
              <td className="pt-6 " colSpan={3}>
                {examTicket.date.getTime() > Date.now() ? (
                  <div className="items-center desktop-body1 flex flex-col justify-between py-[2px] w-fit">
                    <p className="font-medium">
                      {t('dashboard.credentials.seatBooked')}
                    </p>
                    <span className="mt-6">
                      {t('dashboard.credentials.takePlaceAt')}
                    </span>
                    <span>{examTicket.addressLine1}</span>
                    <span>{examTicket.addressLine2}</span>
                    <span>{examTicket.addressLine3}</span>
                    <span>
                      {`${formatDate(examTicket.date)} at ${formatTime(examTicket.date, examTicket.timezone || 'UTC')} (${examTicket.timezone || 'UTC'}`}
                    </span>
                    <SeeTicket />
                  </div>
                ) : (
                  <div className="items-center desktop-body1 flex flex-col justify-between py-[2px] w-fit">
                    <p className="font-medium text-center">
                      {t('dashboard.credentials.beingGraded')}
                    </p>
                    <img className="mt-6" src={SandClockGif} alt="Sandclock" />
                  </div>
                )}
              </td>
              <td />
            </>
          )}
        </tr>
      )}
    </>
  );
};

const NoResults = () => {
  return (
    <tr>
      <td
        className="text-newBlack-4 whitespace-pre-line text-center pt-6"
        colSpan={6}
      >
        <Trans i18nKey="dashboard.bCertificate.noResults">
          <a
            href="mailto:contact@planb.network"
            className="underline underline-offset-2 hover:text-darkOrange-5"
          >
            reach out to us
          </a>
        </Trans>
      </td>
    </tr>
  );
};

const TableHead = () => {
  const isMobile = useSmaller('md');

  return (
    <thead>
      {isMobile ? (
        <tr className="border-b border-newGray-1 text-left">
          <th className="w-2/12 py-2 mobile-subtitle2 md:desktop-typo2 pr-1.5">
            {t('words.date')}
          </th>
          <th className="mobile-subtitle2 md:desktop-typo2 px-1.5">
            {t('conferences.location')}
          </th>
          <th className="w-[8%] mobile-subtitle2 md:desktop-typo2 px-1.5">
            {t('words.status')}
          </th>
        </tr>
      ) : (
        <tr className="border-b border-newGray-1 text-left">
          <th className="w-2/12 py-2 mobile-subtitle2 md:desktop-typo2 pr-1.5">
            {t('words.date')}
          </th>
          <th className="mobile-subtitle2 md:desktop-typo2 px-1.5">
            {t('conferences.location')}
          </th>
          <th className="w-2/12 mobile-subtitle2 md:desktop-typo2 px-1.5">
            {t('words.id')}
          </th>
          <th className="w-[8%] mobile-subtitle2 md:desktop-typo2 px-1.5">
            {t('dashboard.bCertificate.grade')}
          </th>
          <th className="w-[15%] mobile-subtitle2 md:desktop-typo2 pl-6">
            {t('words.status')}
          </th>
        </tr>
      )}
    </thead>
  );
};

const TableFooter = ({
  isLastElementSelected,
  hasOneElementOpen,
}: {
  isLastElementSelected: boolean;
  hasOneElementOpen: boolean;
}) => {
  return (
    <tfoot className="">
      <tr className="">
        <td
          colSpan={6}
          className={cn(
            'rounded-b-xl h-4 mb-4 ',
            isLastElementSelected ? 'bg-newGray-6 ' : '',
            hasOneElementOpen ? 'shadow-lg' : '',
          )}
        />
      </tr>
    </tfoot>
  );
};

const BcertDetails = ({
  exam,
  examScore,
  examIndex,
}: {
  exam: JoinedBCertificateResults;
  examScore: number;
  examIndex: number;
}) => {
  return (
    <>
      <p className="text-newOrange-5 uppercase text-sm font-medium mb-2">
        {t('words.details')}
      </p>
      {[...exam.results].reverse().map((result, resultIndex) => (
        <div
          className="mt-2 desktop-body1"
          key={`${examIndex}-${result.category}`}
        >
          <div className="flex flew-row justify-between border-b py-[2px]  border-newGray-4">
            <span>
              {t('words.part')}{' '}
              {`${resultIndex + 1} - ${capitalize(result.category)}`}
            </span>
            <span>{`${result.score}/20`}</span>
          </div>
        </div>
      ))}
      <div className="flex flex-row font-medium mt-4 justify-between">
        <span>{t('words.total')}</span>

        <span>
          {examScore} / {exam.results.length * 20}
        </span>
      </div>
    </>
  );
};
