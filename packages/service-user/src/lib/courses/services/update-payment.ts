import type { Dependencies } from '../../../dependencies.js';
import { updateCourseCoupon } from '../queries/update-course-coupon.js';
import {
  updateCoursePaymentQuery,
  updatePaymentInvoiceId,
} from '../queries/update-payment.js';

type Options = { id: string } & (
  | { isPaid: true; isExpired: false }
  | { isPaid: false; isExpired: true }
);

export const createUpdateCoursePayment = ({ postgres }: Dependencies) => {
  return async (options: Options) => {
    const coursePayment = await postgres.exec(
      updateCoursePaymentQuery(options),
    );

    if (options.isPaid) {
      await postgres.exec(updateCourseCoupon({ paymentId: options.id }));
    }

    return coursePayment && coursePayment.length === 1
      ? coursePayment[0]
      : null;
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
    const coursePayments = await postgres.exec(updatePaymentInvoiceId(options));
    return coursePayments && coursePayments.length === 1
      ? coursePayments[0]
      : null;
  };
};
