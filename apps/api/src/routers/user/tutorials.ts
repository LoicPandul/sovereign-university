import { z } from 'zod';

import {
  createGetExistingLikeTutorial,
  createLikeTutorial,
} from '@blms/service-user';

import { studentProcedure } from '#src/procedures/protected.js';
import { createTRPCRouter } from '#src/trpc/index.js';
import type { Parser } from '#src/trpc/types.js';

const likeTutorialProcedure = studentProcedure
  .input(z.object({ id: z.string(), liked: z.boolean() }))
  .output<Parser<void>>(z.void())
  .mutation(({ ctx, input }) =>
    createLikeTutorial(ctx.dependencies)({
      uid: ctx.user.uid,
      // tutorial id
      id: input.id,
      liked: input.liked,
    }),
  );

const getExistingLikeTutorialProcedure = studentProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) =>
    createGetExistingLikeTutorial(ctx.dependencies)({
      uid: ctx.user.uid,
      // tutorial id
      id: input.id,
    }),
  );

export const userTutorialsRouter = createTRPCRouter({
  likeTutorial: likeTutorialProcedure,
  getExistingLikeTutorial: getExistingLikeTutorialProcedure,
});
