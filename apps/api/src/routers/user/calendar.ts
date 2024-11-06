import { z } from 'zod';

import { calendarEventSchema } from '@blms/schemas';
import { createGetCalendarEvents } from '@blms/service-user';
import type { CalendarEvent } from '@blms/types';

import { studentProcedure } from '#src/procedures/protected.js';
import { createTRPCRouter } from '#src/trpc/index.js';
import type { Parser } from '#src/trpc/types.js';

const calendarInputSchema = z.object({
  language: z.string(),
  upcomingEvents: z.boolean().optional(),
});

const getCalendarEventsProcedure = studentProcedure
  .input(calendarInputSchema)
  .output<Parser<CalendarEvent[]>>(calendarEventSchema.array())
  .query(async ({ ctx, input }) => {
    return createGetCalendarEvents(ctx.dependencies)({
      uid: ctx.user.uid,
      language: input.language,
      upcomingEvents: input?.upcomingEvents ?? false,
    });
  });

export const userCalendarRouter = createTRPCRouter({
  getCalendarEvents: getCalendarEventsProcedure,
});
