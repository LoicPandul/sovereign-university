import type { Dependencies } from '../../../dependencies.js';
import { generateRandomContributorId } from '../utils/contribution.js';

import { createCheckContributorIdExists } from './check-contributor-id-exists.js';

export const createGenerateUniqueContributorId = (ctx: Dependencies) => {
  const contributorIdExists = createCheckContributorIdExists(ctx);

  return async () => {
    let contributorId: string;

    do {
      contributorId = generateRandomContributorId();
    } while (await contributorIdExists(contributorId));

    return contributorId;
  };
};
