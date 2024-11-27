import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

import type { CheckoutData } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { insertEventPayment } from '../queries/insert-event-payment.js';
import { updateEventPayment } from '../queries/update-event-payment.js';

const stripeSecret = process.env['STRIPE_SECRET'];
const stripe = new Stripe(stripeSecret ? stripeSecret : '');

interface Options {
  uid: string;
  eventId: string;
  satsPrice: number;
  dollarPrice: number;
  method: string;
  withPhysical: boolean;
}

export const createSaveEventPayment = ({ postgres }: Dependencies) => {
  return async ({
    uid,
    eventId,
    satsPrice,
    dollarPrice,
    method,
    withPhysical,
  }: Options) => {
    if (method === 'sbp') {
      const paymentData = {
        title: eventId,
        amount: satsPrice,
        unit: 'sat',
        onChain: true,
        webhook: `${process.env['PUBLIC_PROXY_URL']}/users/events/payment/webhooks`,
      };

      const headers = new Headers({
        'Content-Type': 'application/json',
        'api-key': process.env['SBP_API_KEY'] || '',
      });

      try {
        const response = await fetch(
          `https://api.swiss-bitcoin-pay.ch/checkout`,
          {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(paymentData),
          },
        );

        const checkoutData = (await response.json()) as CheckoutData;

        await postgres.exec(
          insertEventPayment({
            uid,
            eventId,
            paymentStatus: 'pending',
            amount: checkoutData.amount,
            paymentId: checkoutData.id,
            invoiceUrl: checkoutData.checkoutUrl,
            method: method,
            withPhysical: withPhysical,
          }),
        );

        return checkoutData;
      } catch (error) {
        console.log('Checkout error : ');
        console.log(error);
        throw new Error('Checkout error');
      }
    } else {
      const paymentId = uuidv4();

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        ui_mode: 'embedded',
        invoice_creation: {
          enabled: true,
        },
        billing_address_collection: 'required',
        metadata: {
          product: 'event',
        },
        payment_intent_data: {
          metadata: {
            paymentId: paymentId,
            product: 'event',
          },
        },
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: dollarPrice * 100,
              product_data: {
                name: `${eventId}: ${withPhysical ? 'inperson' : 'online'} event`,
              },
            },
            quantity: 1,
          },
        ],
        redirect_on_completion: 'never',
        automatic_tax: { enabled: true },
      });

      await postgres.exec(
        insertEventPayment({
          uid,
          eventId,
          withPhysical,
          paymentId,
          amount: dollarPrice,
          paymentStatus: 'pending',
          invoiceUrl: '',
          method: method,
          // couponCode: couponCode,
        }),
      );

      return {
        id: paymentId,
        pr: '',
        onChainAddr: undefined,
        amount: dollarPrice,
        checkoutUrl: session.id,
        clientSecret: session.client_secret as string,
      };
    }
  };
};

export const createUpdateEventPaymentStatus = ({ postgres }: Dependencies) => {
  return async ({
    paymentId,
    paymentIntentId,
  }: {
    paymentId: string;
    paymentIntentId: string;
  }) => {
    await postgres.exec(
      updateEventPayment({
        id: paymentId,
        intentId: paymentIntentId,
        isPaid: true,
        isExpired: false,
      }),
    );
  };
};
