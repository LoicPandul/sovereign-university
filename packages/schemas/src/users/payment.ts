import { z } from 'zod';

export const checkoutDataSchema = z.object({
  id: z.string(),
  pr: z.string(),
  onChainAddr: z.string().optional(),
  amount: z.number(),
  checkoutUrl: z.string(),
  clientSecret: z.string().optional(),
});

export const stripeSessionSchema = z.object({
  status: z.string(),
});
