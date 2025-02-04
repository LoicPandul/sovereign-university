import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  contentEventLocation,
  contentEvents,
  eventTypeEnum,
  usersEventPayment,
} from '@blms/database';

export const eventTypeSchema = z.enum(eventTypeEnum.enumValues);

export const eventSchema = createSelectSchema(contentEvents);

export const joinedEventSchema = eventSchema.merge(
  z
    .object({
      tags: z.array(z.string()),
      languages: z.array(z.string()),
    })
    .merge(
      z.object({
        projectName: z.string().optional(),
      }),
    ),
);

export const eventPaymentSchema = createSelectSchema(usersEventPayment);

export const eventLocationSchema = createSelectSchema(contentEventLocation);
