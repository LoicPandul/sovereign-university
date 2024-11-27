import type { Dependencies } from '../../../dependencies.js';
import {
  updateEventPayment,
  updateEventPaymentInvoiceId,
} from '../queries/update-event-payment.js';

interface Options {
  id: string;
  isPaid: boolean;
  isExpired: boolean;
}

export const createUpdateEventPayment = ({ postgres }: Dependencies) => {
  return async (options: Options) => {
    await postgres.exec(updateEventPayment(options));
  };
};

interface Options2 {
  intentId: string;
  stripeInvoiceId: string;
  invoiceUrl: string;
}

export const createUpdateEventPaymentInvoiceId = ({
  postgres,
}: Dependencies) => {
  return async (options: Options2) => {
    await postgres.exec(updateEventPaymentInvoiceId(options));
  };
};
