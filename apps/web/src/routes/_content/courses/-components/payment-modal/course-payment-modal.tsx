import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type {
  CheckoutData,
  CouponCode,
  JoinedCourseWithAll,
} from '@blms/types';
import { Button, Dialog, DialogContent } from '@blms/ui';

import { PaymentDescription } from '#src/components/payment-description.js';
import { PaymentQr } from '#src/components/payment-qr.js';
import { addSpaceToCourseId } from '#src/utils/courses.js';
import { trpc } from '#src/utils/trpc.js';

import { ModalPaymentSuccess } from './modal-payment-success.tsx';
import { ModalPaymentSummary } from './modal-payment-summary.tsx';

interface WebSocketMessage {
  status: string;
}

interface CoursePaymentModalProps {
  course: JoinedCourseWithAll;
  professorNames: string;
  satsPrice: number;
  dollarPrice: number;
  isOpen: boolean;
  coursePaymentFormat: 'online' | 'inperson';
  onClose: (isPaid?: boolean) => void;
}

export const CoursePaymentModal = ({
  course,
  professorNames,
  satsPrice,
  dollarPrice,
  isOpen,
  coursePaymentFormat,
  onClose,
}: CoursePaymentModalProps) => {
  const { t } = useTranslation();

  const savePaymentRequest = trpc.user.courses.saveCoursePayment.useMutation();
  const saveFreePaymentRequest =
    trpc.user.courses.saveFreePayment.useMutation();

  const { data: config } = trpc.auth.config.useQuery();

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>();
  const [method, setMethod] = useState<'sbp' | 'stripe' | null>(null);
  const [validatedCoupon, setValidatedCoupon] = useState<CouponCode | null>(
    null,
  );
  const [coursePriceDollarsReduced, setCoursePriceDollarsReduced] =
    useState(dollarPrice);
  const [satsPriceReduced, setSatsPriceReduced] = useState(satsPrice);

  let stripePromise = null;
  if (config) {
    stripePromise = loadStripe(config?.stripePublicKey || '');
  }

  const initCoursePayment = useCallback(
    async (method: 'sbp' | 'stripe' | null) => {
      async function saveFreePayment() {
        const serverCheckoutData = await saveFreePaymentRequest.mutateAsync({
          courseId: course.id,
          couponCode: validatedCoupon?.code,
          format: coursePaymentFormat,
        });
        setCheckoutData(serverCheckoutData);
        setIsPaymentSuccess(true);
      }

      async function savePayment() {
        if (method) {
          const serverCheckoutData = await savePaymentRequest.mutateAsync({
            courseId: course.id,
            satsPrice: satsPriceReduced,
            dollarPrice: coursePriceDollarsReduced,
            couponCode: validatedCoupon?.code,
            format: coursePaymentFormat,
            method: method,
          });
          setCheckoutData(serverCheckoutData);
        }
      }

      setMethod(method);

      await (satsPriceReduced === 0 ? saveFreePayment() : savePayment());
    },
    [
      course.id,
      coursePaymentFormat,
      coursePriceDollarsReduced,
      satsPriceReduced,
      saveFreePaymentRequest,
      savePaymentRequest,
      validatedCoupon?.code,
    ],
  );

  useEffect(() => {
    setSatsPriceReduced(satsPrice);
  }, [satsPrice]);

  useEffect(() => {
    setCoursePriceDollarsReduced(dollarPrice);
  }, [dollarPrice]);

  useEffect(() => {
    if (checkoutData && isOpen && satsPrice >= 0) {
      const ws = new WebSocket('wss://api.swiss-bitcoin-pay.ch/invoice');

      ws.addEventListener('open', () => {
        ws.send(JSON.stringify({ id: checkoutData.id }));
      });

      const handleMessage = (event: MessageEvent) => {
        const message: WebSocketMessage = JSON.parse(
          event.data as string,
        ) as WebSocketMessage;
        if (message.status === 'settled') {
          setIsPaymentSuccess(true);
        }
      };

      ws.addEventListener('message', handleMessage);

      return () => {
        ws.removeEventListener('message', handleMessage);
        ws.close();
      };
    }
  }, [checkoutData, isOpen, satsPrice]);

  function updateCoupon(coupon: CouponCode | null) {
    setValidatedCoupon(coupon);
    if (coupon && coupon.reductionPercentage) {
      setSatsPriceReduced(
        Math.ceil((satsPrice * (100 - coupon.reductionPercentage)) / 100),
      );
      if (dollarPrice) {
        setCoursePriceDollarsReduced(
          (dollarPrice * (100 - coupon.reductionPercentage)) / 100,
        );
      }
    }

    if (!coupon) {
      setSatsPriceReduced(satsPrice);
      setCoursePriceDollarsReduced(dollarPrice);
      setValidatedCoupon(null);
    }
  }

  const courseName = `${addSpaceToCourseId(course?.id)} - ${course?.name}`;

  return (
    <div className="p-4">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setCheckoutData(undefined);
          onClose(open ? undefined : false);
        }}
      >
        <DialogContent className="max-h-screen w-[90%] lg:w-full max-w-[1440px] h-[90vh] sm:w-[80vw] lg:p-0 sm:h-[85vh] overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-6 lg:gap-0">
            <ModalPaymentSummary
              course={course}
              courseName={courseName}
              professorNames={professorNames}
              mobileDisplay={false}
            />
            <div className="flex flex-col items-center justify-center lg:m-6">
              {checkoutData ? (
                isPaymentSuccess &&
                (satsPriceReduced === 0 || method === 'sbp') ? (
                  <ModalPaymentSuccess
                    checkoutData={checkoutData}
                    onClose={onClose}
                  />
                ) : method === 'sbp' ? (
                  <PaymentQr
                    checkoutData={checkoutData}
                    onBack={() => setCheckoutData(undefined)}
                  />
                ) : (
                  <div className="flex flex-col">
                    <EmbeddedCheckoutProvider
                      stripe={stripePromise}
                      options={{
                        clientSecret: checkoutData.clientSecret,
                      }}
                    >
                      <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                    <Button
                      className="mt-4"
                      variant="outline"
                      onClick={() => {
                        setCheckoutData(undefined);
                        onClose();
                      }}
                    >
                      {t('words.close')}
                    </Button>
                  </div>
                )
              ) : (
                <PaymentDescription
                  paidPriceDollars={coursePriceDollarsReduced}
                  satsPrice={satsPriceReduced}
                  initPayment={initCoursePayment}
                  description={
                    coursePaymentFormat === 'inperson'
                      ? t('courses.payment.inPersonDescription')
                      : t('courses.payment.onlineDescription')
                  }
                  callout={
                    coursePaymentFormat === 'inperson' ? (
                      <Trans i18nKey="courses.payment.inPersonCallout">
                        You are about to purchase <strong>in-person</strong>{' '}
                        access to this course.
                      </Trans>
                    ) : (
                      <Trans i18nKey="courses.payment.onlineCallout">
                        You are about to purchase <strong>online</strong> access
                        to this course.
                      </Trans>
                    )
                  }
                  itemId={course.id}
                  updateCoupon={updateCoupon}
                ></PaymentDescription>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
