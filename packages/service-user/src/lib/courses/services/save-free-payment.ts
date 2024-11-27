import { v4 as uuidv4 } from 'uuid';

import type { CheckoutData } from '@blms/types';

import type { Dependencies } from '../../../dependencies.js';
import { insertCoursePayment } from '../queries/insert-course-payment.js';
import { updateCoupon } from '../queries/update-coupon.js';

interface Options {
  uid: string;
  courseId: string;
  couponCode?: string;
  format: string;
}

export const createSaveFreePayment = ({ postgres }: Dependencies) => {
  return async (opts: Options): Promise<CheckoutData> => {
    try {
      const randomUUID = uuidv4();

      const payment = await postgres.exec(
        insertCoursePayment({
          paymentStatus: 'paid',
          amount: 0,
          paymentId: randomUUID,
          method: 'free',
          invoiceUrl: '',
          ...opts,
        }),
      );

      if (payment && payment.length > 0) {
        await postgres.exec(
          updateCoupon({
            paymentId: payment[0].paymentId,
          }),
        );
      }

      return {
        id: '',
        pr: '',
        onChainAddr: '',
        amount: 0,
        checkoutUrl: '',
      };
    } catch (error) {
      console.log(error);
    }

    throw new Error('createSaveFreePayment error');
  };
};
