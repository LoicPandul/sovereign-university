import { sql } from '@blms/database';
import type { EventPayment } from '@blms/types';

export const insertEventPayment = ({
  uid,
  eventId,
  paymentStatus,
  amount,
  paymentId,
  invoiceUrl,
  method,
  withPhysical,
  couponCode,
}: {
  uid: string;
  eventId: string;
  paymentStatus: string;
  amount: number;
  paymentId: string;
  invoiceUrl: string;
  method: string;
  withPhysical: boolean;
  couponCode?: string;
}) => {
  return sql<EventPayment[]>`
  INSERT INTO users.event_payment (
    uid, event_id, payment_status, amount, payment_id, invoice_url, method, with_physical, coupon_code
  ) VALUES (
    ${uid}, ${eventId}, ${paymentStatus}, ${amount}, ${paymentId}, ${invoiceUrl}, ${method}, ${withPhysical}, ${couponCode ? couponCode : null}
  )
  ON CONFLICT (uid, event_id, payment_id) DO UPDATE SET
    payment_status = EXCLUDED.payment_status,
    amount = EXCLUDED.amount,
    invoice_url = EXCLUDED.invoice_url
  RETURNING *;
  `;
};
