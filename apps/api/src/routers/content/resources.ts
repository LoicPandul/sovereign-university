import { z } from 'zod';

import {
  joinedBookSchema,
  joinedBuilderSchema,
  joinedConferenceSchema,
  joinedGlossaryWordSchema,
  joinedPodcastSchema,
} from '@blms/schemas';
import {
  createGetBets,
  createGetBook,
  createGetBooks,
  createGetBuilder,
  createGetBuilders,
  createGetConference,
  createGetConferences,
  createGetGlossaryWord,
  createGetGlossaryWords,
  createGetPodcast,
  createGetPodcasts,
} from '@blms/service-content';

import { publicProcedure } from '../../procedures/index.js';
import { createTRPCRouter } from '../../trpc/index.js';

const createGetResourcesProcedure = () => {
  return publicProcedure.input(
    z.object({ language: z.string().optional() }).optional(),
  );
};

const createGetResourceProcedure = () => {
  return publicProcedure.input(
    z.object({ id: z.number(), language: z.string() }),
  );
};

const createGetResourceProcedureWithStrId = () => {
  return publicProcedure.input(
    z.object({ strId: z.string(), language: z.string() }),
  );
};

export const resourcesRouter = createTRPCRouter({
  // Bets
  getBets: createGetResourcesProcedure()
    // TODO add output
    // .output(joinedBetSchema.merge(z.object({ logo: z.string() })).array())
    .query(({ ctx, input }) =>
      createGetBets(ctx.dependencies)(input?.language),
    ),
  // Books
  getBooks: createGetResourcesProcedure()
    .output(
      joinedBookSchema
        .merge(z.object({ cover: z.string().optional() }))
        .array(),
    )
    .query(({ ctx, input }) =>
      createGetBooks(ctx.dependencies)(input?.language),
    ),
  getBook: createGetResourceProcedure()
    .output(joinedBookSchema.merge(z.object({ cover: z.string().optional() })))
    .query(({ ctx, input }) =>
      createGetBook(ctx.dependencies)(input.id, input.language),
    ),
  // Builders
  getBuilders: createGetResourcesProcedure()
    .output(joinedBuilderSchema.merge(z.object({ logo: z.string() })).array())
    .query(({ ctx, input }) =>
      createGetBuilders(ctx.dependencies)(input?.language),
    ),
  getBuilder: createGetResourceProcedure()
    .output(joinedBuilderSchema.merge(z.object({ logo: z.string() })))
    .query(({ ctx, input }) =>
      createGetBuilder(ctx.dependencies)(input.id, input.language),
    ),
  // Conferences
  getConferences: createGetResourcesProcedure()
    .output(
      joinedConferenceSchema.merge(z.object({ thumbnail: z.string() })).array(),
    )
    .query(({ ctx }) => createGetConferences(ctx.dependencies)()),
  getConference: createGetResourceProcedure()
    .output(joinedConferenceSchema.merge(z.object({ thumbnail: z.string() })))
    .query(({ ctx, input }) => createGetConference(ctx.dependencies)(input.id)),
  // Glossary Words
  getGlossaryWords: createGetResourcesProcedure()
    .output(joinedGlossaryWordSchema.array())
    .query(({ ctx, input }) =>
      createGetGlossaryWords(ctx.dependencies)(input?.language),
    ),
  getGlossaryWord: createGetResourceProcedureWithStrId()
    .output(joinedGlossaryWordSchema)
    .query(({ ctx, input }) =>
      createGetGlossaryWord(ctx.dependencies)(input.strId, input.language),
    ),
  // Podcasts
  getPodcasts: createGetResourcesProcedure()
    .output(joinedPodcastSchema.merge(z.object({ logo: z.string() })).array())
    .query(({ ctx, input }) =>
      createGetPodcasts(ctx.dependencies)(input?.language),
    ),
  getPodcast: createGetResourceProcedure()
    .output(joinedPodcastSchema.merge(z.object({ logo: z.string() })))
    .query(({ ctx, input }) =>
      createGetPodcast(ctx.dependencies)(input.id, input.language),
    ),
});
