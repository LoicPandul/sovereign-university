import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaArrowRightLong } from 'react-icons/fa6';
import { IoCheckmark } from 'react-icons/io5';
import { z } from 'zod';

import type { CourseChapterResponse, CourseReview } from '@blms/types';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Loader,
  Ratings,
  Slider,
  Textarea,
  cn,
  customToast,
} from '@blms/ui';

import LockGif from '#src/assets/icons/lock.gif';
import { AuthModal } from '#src/components/AuthModals/auth-modal.tsx';
import { AuthModalState } from '#src/components/AuthModals/props.ts';
import { useDisclosure } from '#src/hooks/use-disclosure.ts';
import { useSmaller } from '#src/hooks/use-smaller.ts';
import { goToChapterParameters } from '#src/utils/courses.js';
import { trpc } from '#src/utils/trpc.js';

const formDivClass = 'mb-6';

function FormSlider({
  id,
  form,
  label,
  stepNames,
  disabled,
}: {
  id: string;
  form: any;
  label: string;
  stepNames: string[];
  disabled?: boolean;
}) {
  const sliderProps = {
    min: -5,
    default: [0],
    max: 5,
    step: 1,
  };

  return (
    <div className="flex flex-col">
      <div className="mb-5 w-full h-px my-2.5 bg-newGray-4" />
      <div className={formDivClass}>
        <FormField
          control={form.control}
          name={id}
          render={({ field: { value, onChange } }) => (
            <FormItem className="space-y-2">
              <FormLabel className="mb-3.5">{label}</FormLabel>
              <FormControl>
                <Slider
                  {...sliderProps}
                  id={id}
                  disabled={disabled}
                  defaultValue={[value]}
                  onValueChange={(vals) => {
                    onChange(vals[0]);
                  }}
                  value={[form.getValues(id)]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="relative mt-4">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 max-w-[95%] mx-auto">
            <div className="relative flex justify-between">
              {Array.from({ length: 11 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={i}
                  className="w-[2px] h-1 bg-newGray-3"
                  style={{ left: `${(i / 10) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="relative mt-8">
          <div className="flex lg:flex-col max-lg:justify-between body-14px-medium text-newGray-1 text-center">
            {stepNames[0] && (
              <span className="lg:absolute lg:self-start lg:-translate-x-1/2 max-lg:w-1/4 text-left">
                {stepNames[0]}
              </span>
            )}
            {stepNames[1] && (
              <span className="lg:absolute lg:self-center max-lg:w-1/4 text-center">
                {stepNames[1]}
              </span>
            )}
            {stepNames[2] && (
              <span className="lg:absolute lg:self-end lg:translate-x-1/2 max-lg:w-1/4 text-right">
                {stepNames[2]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormTextArea({
  id,
  control,
  label,
  disabled,
}: {
  id: string;
  control: any;
  label: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name={id}
      render={({ field }: { field: any }) => (
        <FormItem className="space-y-2">
          <FormLabel
            removeDefaultClasses
            className="block text-left md:text-center label-medium-med-16px md:subtitle-large-med-20px text-dashboardSectionText"
          >
            {label}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={t('courses.review.writeThoughts')}
              rows={3}
              disabled={disabled}
              className="w-full rounded-md px-4 py-2.5 text-newBlack-1 placeholder:text-newGray-2 border border-newGray-4 bg-white subtitle-medium-med-16px"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CourseReviewComponent({
  chapter,
  courseId,
  chapterId,
  existingReview,
  formDisabled = false,
  isDashboardReview,
  isConclusionReview,
  isLockedReview,
  onReviewSuccess,
  onSkip,
}: {
  chapter?: CourseChapterResponse;
  courseId: string;
  chapterId: string;
  existingReview?: CourseReview;
  formDisabled?: boolean;
  isDashboardReview?: boolean;
  isConclusionReview?: boolean;
  isLockedReview?: boolean;
  onReviewSuccess?: () => void;
  onSkip?: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: fetchedCourseReview, isFetched: isReviewFetched } =
    trpc.user.courses.getCourseReview.useQuery(
      {
        courseId: chapter?.courseId || courseId || '',
      },
      {
        enabled: !formDisabled && !!(chapter || courseId) && !existingReview,
      },
    );

  const previousCourseReview = existingReview || fetchedCourseReview;

  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (isReviewFetched) {
      setIsEditable(!previousCourseReview && !formDisabled);
    }
  }, [isReviewFetched, previousCourseReview, formDisabled]);

  const saveCourseReview = trpc.user.courses.saveCourseReview.useMutation({
    onSuccess: () => {
      if (isConclusionReview && onReviewSuccess) {
        onReviewSuccess();
      }
    },
  });

  const {
    open: openAuthModal,
    isOpen: isAuthModalOpen,
    close: closeAuthModal,
  } = useDisclosure();

  const authMode = AuthModalState.SignIn;

  const FormSchema = z.object({
    general: z
      .number()
      .min(1, { message: t('courses.review.fieldRequired') })
      .max(5),
    length: z.number().min(-5).max(5),
    difficulty: z.number().min(-5).max(5),
    quality: z.number().min(-5).max(5),
    faithful: z.number().min(-5).max(5),
    recommand: z.number().min(-5).max(5),
    publicComment: z.string(),
    teacherComment: z.string(),
    adminComment: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      general: 0,
      length: 0,
      difficulty: 0,
      quality: 0,
      faithful: 0,
      recommand: 0,
      publicComment: '',
      teacherComment: '',
      adminComment: '',
    },
  });

  useEffect(() => {
    if (previousCourseReview) {
      form.setValue('general', previousCourseReview.general);
      form.setValue('length', previousCourseReview.length);
      form.setValue('difficulty', previousCourseReview.difficulty);
      form.setValue('quality', previousCourseReview.quality);
      form.setValue('faithful', previousCourseReview.faithful);
      form.setValue('recommand', previousCourseReview.recommand);
      form.setValue('publicComment', previousCourseReview.publicComment ?? '');
      form.setValue(
        'teacherComment',
        previousCourseReview.teacherComment ?? '',
      );
      form.setValue('adminComment', previousCourseReview.adminComment ?? '');
    }
  }, [previousCourseReview]);

  const isLastChapter =
    chapter &&
    chapter.chapterIndex === chapter.part.chapters.length &&
    chapter.part.partIndex === chapter.course.parts.length;

  async function onSubmit() {
    if (!chapterId || !courseId) {
      return;
    }

    await saveCourseReview.mutateAsync({
      ...form.getValues(),
      courseId: chapter?.courseId || courseId || '',
      chapterId: chapterId || '',
    });

    navigateToNextChapter();
  }

  function navigateToNextChapter() {
    if (!chapter) {
      return;
    }

    if (isLastChapter) {
      navigate({
        to: '/courses/$courseId',
        params: goToChapterParameters(chapter, 'next'),
      });
    } else {
      navigate({
        to: '/courses/$courseId/$chapterId',
        params: goToChapterParameters(chapter, 'next'),
      });
    }
  }

  const isMobile = useSmaller('md');

  let displayBottomButtons = true;
  if (isDashboardReview) displayBottomButtons = false;
  if (isConclusionReview && previousCourseReview) displayBottomButtons = false;

  return (
    <div className={cn('flex flex-col')} id="reviewForm">
      {isReviewFetched || formDisabled ? (
        <>
          {!existingReview && !isLockedReview && (
            <>
              <h1
                className={cn('text-center md:text-2xl mb-6 text-newBlack-1')}
              >
                {t('courses.review.feedbackSessionTitle')}
              </h1>
              <div className="text-center max-md:body-14px md:whitespace-pre-line text-newBlack-1">
                <p>{t('courses.review.feedbackDescription1')}</p>
                <p>{t('courses.review.feedbackDescription2')}</p>
              </div>
            </>
          )}
          <div className="w-full max-w-[550px] self-center">
            <Form {...form}>
              <div className="relative">
                {isLockedReview && (
                  <img
                    src={LockGif}
                    alt="Locked"
                    className="absolute -top-6 md:-top-10 right-0 z-10 size-16 md:size-24"
                  />
                )}
                <form
                  onSubmit={form.handleSubmit(async () => {
                    if (isEditable) {
                      await onSubmit();
                      setIsEditable(false);
                      customToast(t('courses.review.thankYou'), {
                        closeOnClick: true,
                        mode: 'light',
                        color: 'success',
                        icon: IoCheckmark,
                        closeButton: true,
                        time: 3000,
                      });
                    } else {
                      setIsEditable(true);
                    }
                  }, scrollToForm)}
                  className={cn(
                    'flex max-lg:flex-col gap-6 lg:gap-10 mt-6',
                    isLockedReview &&
                      'pointer-events-none bg-newGray-6 shadow-course-navigation blur-[1.5px] rounded-lg md:rounded-[20px] py-5 px-2 relative',
                  )}
                  onClick={() => {
                    formDisabled && openAuthModal();
                  }}
                  onKeyDown={() => {
                    formDisabled && openAuthModal();
                  }}
                >
                  <div className="w-full flex flex-col gap-5">
                    <div className="flex flex-col gap-5 md:px-10">
                      <FormField
                        control={form.control}
                        name={'general'}
                        render={({ field }: { field: any }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="!mb-5 md:!mb-4">
                              {t('courses.review.generalGrade')}
                            </FormLabel>
                            <FormControl>
                              <div
                                className={cn(
                                  'md:bg-newGray-6 md:py-7 md:rounded-full w-full max-md:max-w-[270px] md:w-fit mx-auto md:px-11 md:shadow-course-navigation',
                                  !isEditable && 'pointer-events-none',
                                )}
                              >
                                <Ratings
                                  id="general"
                                  variant={isEditable ? 'yellow' : 'disabled'}
                                  disabled={!isEditable}
                                  totalStars={5}
                                  size={isMobile ? 40 : 30}
                                  onValueChange={(v) => {
                                    form.setValue('general', v);
                                  }}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="w-full text-center" />
                          </FormItem>
                        )}
                      />

                      <FormSlider
                        id="length"
                        form={form}
                        label={t('courses.review.length')}
                        stepNames={[
                          t('courses.review.tooShort'),
                          t('courses.review.asExpected'),
                          t('courses.review.tooLong'),
                        ]}
                        disabled={!isEditable}
                      />

                      <FormSlider
                        id="difficulty"
                        form={form}
                        label={t('courses.review.difficulty')}
                        stepNames={[
                          t('courses.review.tooEasy'),
                          t('courses.review.asExpected'),
                          t('courses.review.tooHard'),
                        ]}
                        disabled={!isEditable}
                      />

                      <FormSlider
                        id="quality"
                        form={form}
                        label={t('courses.review.quality')}
                        stepNames={[
                          t('courses.review.veryBad'),
                          t('courses.review.soAndSo'),
                          t('courses.review.veryGood'),
                        ]}
                        disabled={!isEditable}
                      />

                      <FormSlider
                        id="faithful"
                        form={form}
                        label={t('courses.review.faithful')}
                        stepNames={[
                          t('courses.review.notReally'),
                          t('courses.review.neutral'),
                          t('courses.review.yesVeryMuch'),
                        ]}
                        disabled={!isEditable}
                      />

                      <FormSlider
                        id="recommand"
                        form={form}
                        label={t('courses.review.recommend')}
                        stepNames={[
                          t('courses.review.no'),
                          t('courses.review.soAndSo'),
                          t('courses.review.yesOfCourse'),
                        ]}
                        disabled={!isEditable}
                      />
                    </div>
                    <div className="mb-5 w-10/12 mx-auto h-px my-2.5 bg-newGray-1" />
                    <div className="flex flex-col gap-6">
                      <FormTextArea
                        id="publicComment"
                        control={form.control}
                        label={
                          isMobile
                            ? t('courses.review.commentPublicMobile')
                            : t('courses.review.commentPublic')
                        }
                        disabled={!isEditable}
                      />

                      <FormTextArea
                        id="teacherComment"
                        control={form.control}
                        label={
                          isMobile
                            ? t('courses.review.commentTeacherMobile')
                            : t('courses.review.commentTeacher')
                        }
                        disabled={!isEditable}
                      />

                      <FormTextArea
                        id="adminComment"
                        control={form.control}
                        label={
                          isMobile
                            ? t('courses.review.commentAdminMobile')
                            : t('courses.review.commentAdmin')
                        }
                        disabled={!isEditable}
                      />
                    </div>

                    {displayBottomButtons && (
                      <div className="flex flex-wrap max-md:flex-col items-center justify-center gap-4 mx-auto mt-6 lg:mt-4">
                        <Button
                          className="w-fit"
                          variant="primary"
                          size={window.innerWidth >= 768 ? 'l' : 'm'}
                          type="submit"
                          disabled={formDisabled}
                        >
                          {previousCourseReview
                            ? isEditable
                              ? t('courses.review.saveReview')
                              : t('courses.review.editReview')
                            : t('courses.review.submitReview')}
                        </Button>

                        {onSkip && (
                          <Button
                            className="w-fit"
                            variant="outline"
                            size={window.innerWidth >= 768 ? 'l' : 'm'}
                            type="button"
                            onClick={onSkip}
                          >
                            {t('words.skip')}
                          </Button>
                        )}

                        {!isLockedReview && !isConclusionReview ? (
                          <Button
                            variant="outline"
                            type="button"
                            className="w-fit"
                            size={window.innerWidth >= 768 ? 'l' : 'm'}
                            onClick={() => {
                              navigateToNextChapter();
                            }}
                          >
                            <span>{t('courses.review.skip')}</span>
                            <FaArrowRightLong
                              className={cn(
                                'opacity-0 max-w-0 inline-flex whitespace-nowrap transition-[max-width_opacity] overflow-hidden ease-in-out duration-150 group-hover:max-w-96 group-hover:opacity-100',
                                'group-hover:ml-3',
                              )}
                            />
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {isDashboardReview && (
                    <Button
                      className="w-full max-w-[152px] h-fit max-lg:self-center lg:self-end"
                      variant="primary"
                      size={isMobile ? 'm' : 'l'}
                      type="submit"
                    >
                      {isEditable
                        ? t('courses.review.saveReview')
                        : t('courses.review.editReview')}
                    </Button>
                  )}
                </form>
              </div>
            </Form>
          </div>
          {isAuthModalOpen && (
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={closeAuthModal}
              initialState={authMode}
            />
          )}
        </>
      ) : (
        <Loader size={'m'} />
      )}
    </div>
  );
}

const scrollToForm = () => {
  document.querySelector('#reviewForm')?.scrollIntoView({ behavior: 'smooth' });
};
