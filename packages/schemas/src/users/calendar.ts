import { z } from 'zod';

export const calendarEventSchema = z.object({
  id: z.string(),
  subId: z.string().nullable(),
  type: z.string(),
  name: z.string(),
  organizer: z.string().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  timezone: z.string().nullable(),
  isOnline: z.boolean(),
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  addressLine3: z.string().nullable(),
});
