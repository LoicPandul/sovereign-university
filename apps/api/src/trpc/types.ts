import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { TrpcRouter } from '../routers/trpc-router.js';

export type { TrpcRouter as AppRouter } from '../routers/trpc-router.js';

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<TrpcRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<TrpcRouter>;

export interface Parser<T> {
  parse: (input: unknown) => T;
}
