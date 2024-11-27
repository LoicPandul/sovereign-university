import type { Dependencies } from '../../../dependencies.js';
import { updateCourseCoupon } from '../queries/update-course-coupon.js';
import {
  updatePayment,
  updatePaymentInvoiceId,
} from '../queries/update-payment.js';

interface Options {
  id: string;
  isPaid: boolean;
  isExpired: boolean;
}

export const createUpdatePayment = ({ postgres }: Dependencies) => {
  return async (options: Options) => {
    await postgres.exec(updatePayment(options));

    if (options.isPaid) {
      await postgres.exec(updateCourseCoupon({ paymentId: options.id }));
    }
  };
};

interface Options2 {
  intentId: string;
  stripeInvoiceId: string;
  invoiceUrl: string;
}

export const createUpdateCoursePaymentInvoiceId = ({
  postgres,
}: Dependencies) => {
  return async (options: Options2) => {
    await postgres.exec(updatePaymentInvoiceId(options));
  };
};
