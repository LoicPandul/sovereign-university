import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  contentBuilderLocation,
  contentBuilders,
  contentBuildersLocalized,
} from '@blms/database';

import { resourceSchema } from './resource.js';

export const projectLocationSchema = createSelectSchema(contentBuilderLocation);

export const projectSchema = createSelectSchema(contentBuilders, {
  languages: z.array(z.string()),
});

export const projectLocalizedSchema = createSelectSchema(
  contentBuildersLocalized,
);

export const joinedProjectSchema = resourceSchema
  .pick({
    id: true,
    path: true,
    lastCommit: true,
  })
  .merge(
    projectSchema.pick({
      name: true,
      category: true,
      languages: true,
      websiteUrl: true,
      twitterUrl: true,
      githubUrl: true,
      nostr: true,
      addressLine1: true,
      addressLine2: true,
      addressLine3: true,
      originalLanguage: true,
    }),
  )
  .merge(
    projectLocalizedSchema.pick({
      language: true,
      description: true,
    }),
  )
  .merge(
    z.object({
      tags: z.array(z.string()).optional(),
    }),
  );
