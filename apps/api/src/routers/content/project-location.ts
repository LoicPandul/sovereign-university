import { projectLocationSchema } from '@blms/schemas';
import { createGetProjectsLocations } from '@blms/service-content';

import { publicProcedure } from '#src/procedures/index.js';
import { createTRPCRouter } from '#src/trpc/index.js';

const getProjectsLocationsProcedure = publicProcedure
  .output(projectLocationSchema.array())
  .query(({ ctx }) => createGetProjectsLocations(ctx.dependencies)());

export const projectLocationRouter = createTRPCRouter({
  getProjectsLocations: getProjectsLocationsProcedure,
});
