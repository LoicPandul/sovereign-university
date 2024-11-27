import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';

import type { CheckoutData, JoinedEvent } from '@blms/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@blms/ui';

import { PaymentDescription } from '#src/components/payment-description.js';
import { PaymentQr } from '#src/components/payment-qr.js';
import { trpc } from '#src/utils/trpc.js';

import { ModalPaymentSuccess } from './modal-payment-success.tsx';
import { ModalPaymentSummary } from './modal-payment-summary.tsx';

interface EventPaymentModalProps {
  eventId: string;
  event: JoinedEvent;
  accessType: 'physical' | 'online' | 'replay';
  satsPrice: number;
  dollarPrice: number;
  isOpen: boolean;
  onClose: (isPaid?: boolean) => void;
}

interface WebSocketMessage {
  status: string;
}

export const EventPaymentModal = ({
  eventId,
  event,
  accessType,
  satsPrice,
  dollarPrice,
  isOpen,
  onClose,
}: EventPaymentModalProps) => {
  const saveEventPaymentRequest =
    trpc.user.events.saveEventPayment.useMutation();

  const { data: config } = trpc.auth.config.useQuery();

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>();
  const [method, setMethod] = useState<'sbp' | 'stripe' | null>(null);

  let stripePromise = null;
  if (config) {
    stripePromise = loadStripe(config?.stripePublicKey || '');
  }

  useEffect(() => {
    if (checkoutData && isOpen) {
      const ws = new WebSocket('wss://api.swiss-bitcoin-pay.ch/invoice/ln');

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
  }, [checkoutData, isOpen]);

  const initEventPayment = useCallback(
    async (method: 'sbp' | 'stripe' | null) => {
      if (method) {
        const serverCheckoutData = await saveEventPaymentRequest.mutateAsync({
          eventId: eventId,
          satsPrice: satsPrice,
          dollarPrice: dollarPrice,
          // couponCode: validatedCoupon?.code,
          withPhysical: accessType === 'physical',
          method: method,
        });

        setCheckoutData(serverCheckoutData);
      }

      setMethod(method);
    },
    [saveEventPaymentRequest, eventId, satsPrice, dollarPrice, accessType],
  );

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
          <DialogTitle className="hidden">Payment Modal</DialogTitle>
          <DialogDescription className="hidden">
            Payment Modal
          </DialogDescription>
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-6 lg:gap-0">
            <ModalPaymentSummary
              event={event}
              accessType={accessType}
              satsPrice={satsPrice}
              mobileDisplay={false}
            />
            <div className="flex flex-col items-center justify-center lg:m-6">
              {checkoutData ? (
                isPaymentSuccess && (satsPrice === 0 || method === 'sbp') ? (
                  <ModalPaymentSuccess
                    event={event}
                    paymentData={checkoutData}
                    accessType={accessType}
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
                      }}
                    >
                      {t('words.back')}
                    </Button>
                  </div>
                )
              ) : (
                <PaymentDescription
                  paidPriceDollars={event.priceDollars}
                  event={event}
                  accessType={accessType}
                  satsPrice={satsPrice}
                  initPayment={initEventPayment}
                  itemId={event.id}
                  description={
                    accessType === 'replay'
                      ? ''
                      : t(`events.payment.description_${accessType}`)
                  }
                  callout={t(`events.payment.callout_${accessType}`)}
                >
                  <ModalPaymentSummary
                    event={event}
                    accessType={accessType}
                    satsPrice={satsPrice}
                    mobileDisplay={true}
                  />
                </PaymentDescription>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
