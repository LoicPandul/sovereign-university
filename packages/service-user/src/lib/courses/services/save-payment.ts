import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

import type { CheckoutData, StripeSession } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { insertPayment } from '../queries/insert-payment.js';
import { updatePayment } from '../queries/update-payment.js';

const stripeSecret = process.env['STRIPE_SECRET'];
const stripe = new Stripe(stripeSecret ? stripeSecret : '');

interface Options {
  uid: string;
  courseId: string;
  amount: number;
  method: string;
  couponCode?: string;
  format: string;
}

export const createSavePayment = ({ postgres }: Dependencies) => {
  return async ({
    uid,
    courseId,
    amount,
    method,
    couponCode,
    format,
  }: Options) => {
    if (method === 'sbp') {
      const paymentData = {
        title: courseId,
        amount: amount,
        unit: 'sat',
        onChain: true,
        webhook: `${process.env['PUBLIC_PROXY_URL']}/users/courses/payment/webhooks`,
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

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const checkoutData = (await response.json()) as CheckoutData;

        await postgres.exec(
          insertPayment({
            uid,
            courseId,
            paymentStatus: 'pending',
            format: format,
            amount: checkoutData.amount,
            paymentId: checkoutData.id,
            invoiceUrl: checkoutData.checkoutUrl,
            method: method,
            couponCode: couponCode,
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
        billing_address_collection: 'required', // TODO check if needed
        payment_intent_data: {
          metadata: {
            paymentId: paymentId,
          },
        },
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: 700,
              product_data: {
                name: courseId + ':' + format,
              },
            },
            quantity: 1,
          },
        ],
        redirect_on_completion: 'never',
        automatic_tax: { enabled: true },
      });

      console.log('STRIPE SESSION', session);

      await postgres.exec(
        insertPayment({
          uid,
          courseId,
          format,
          amount,
          paymentId,
          paymentStatus: 'pending',
          invoiceUrl: '',
          method: method,
          couponCode: couponCode,
        }),
      );

      return {
        id: paymentId,
        pr: '',
        onChainAddr: undefined,
        amount: amount,
        checkoutUrl: session.id,
        clientSecret: session.client_secret as string,
      };
    }
  };
};

export const createGetStripeSession = () => {
  return async ({
    sessionId,
  }: {
    sessionId: string;
  }): Promise<StripeSession> => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      status: session.status as string,
    };
  };
};

export const createUpdateCoursePaymentStatus = ({ postgres }: Dependencies) => {
  return async ({
    paymentId,
    paymentIntentId,
  }: {
    paymentId: string;
    paymentIntentId: string;
  }) => {
    await postgres.exec(
      updatePayment({
        id: paymentId,
        intentId: paymentIntentId,
        isPaid: true,
        isExpired: false,
      }),
    );
  };
};
