import { sql } from '@blms/database';
import type { CoursePaymentLight } from '@blms/types';

export const getPaymentQuery = (paymentId: string) => {
  return sql<CoursePaymentLight[]>`
    SELECT cp.course_id, cp.payment_status, cp.format, cp.amount, cp.payment_id, cp.invoice_url
    FROM  users.course_payment cp
    WHERE cp.payment_id = ${paymentId} ;
  `;
};

export const getPaymentsQuery = (uid: string) => {
  return sql<CoursePaymentLight[]>`
    SELECT cp.course_id, cp.payment_status, cp.format, cp.amount, cp.payment_id, cp.invoice_url
    FROM  users.course_payment cp
    WHERE cp.uid = ${uid};
  `;
};
