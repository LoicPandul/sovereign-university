import { z } from 'zod';

export const invoiceSchema = z.object({
  title: z.string(),
  type: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
  url: z.string(),
  date: z.date(),
});

export const ticketSchema = z.object({
  eventId: z.string(),
  title: z.string(),
  location: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  addressLine3: z.string(),
  timezone: z.string().nullable(),
  type: z.string(),
  date: z.date(),
  isInPerson: z.boolean(),
  isOnline: z.boolean(),
  isPaid: z.boolean(),
});
