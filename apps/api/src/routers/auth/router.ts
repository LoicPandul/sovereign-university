import { z } from 'zod';

import type { Parser } from '#src/trpc/types.js';

import { studentProcedure } from '../../procedures/index.js';
import { createTRPCRouter } from '../../trpc/index.js';

import { credentialsAuthRouter } from './credentials.js';
import { lud4AuthRouter } from './lud4.js';

const logoutProcedure = studentProcedure
  .input(z.void())
  .output<Parser<{ status: number; message: string }>>(
    z.object({
      status: z.number(),
      message: z.string(),
    }),
  )
  .mutation(async ({ ctx }) => {
    const { req } = ctx;

    return new Promise((resolve) => {
      req.session.destroy((error) => {
        if (error) {
          console.error(error);
        }

        resolve({
          status: 200,
          message: 'Logged out successfully',
        });
      });
    });
  });

export const authRouter = createTRPCRouter({
  credentials: credentialsAuthRouter,
  lud4: lud4AuthRouter,
  logout: logoutProcedure,
});
