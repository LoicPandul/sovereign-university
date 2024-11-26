import { z } from 'zod';

export const envConfigEndpointResultSchema = z.object({
  stripePublicKey: z.string(),
});
