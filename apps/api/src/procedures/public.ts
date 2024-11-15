import { loadContextMiddleware } from '#src/middlewares/auth.js';

import { createProcedure } from '../trpc/index.js';

export const publicProcedure = createProcedure().use(loadContextMiddleware);
