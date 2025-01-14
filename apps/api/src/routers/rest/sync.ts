import type { Router } from 'express';

import type { Dependencies } from '#src/dependencies.js';
import {
  createApiKeyMiddleware,
  noopMiddleware,
} from '#src/middlewares/auth.js';

import { createSyncGithubRepositories } from '../../services/github/sync.js';

export const createRestSyncRoutes = (
  dependencies: Dependencies,
  router: Router,
) => {
  let syncLocked = false;

  const protectSyncMiddleware = dependencies.config.protectSyncRoute
    ? createApiKeyMiddleware(dependencies)
    : noopMiddleware;

  const syncGithubRepositories = createSyncGithubRepositories(dependencies);

  router.post(
    '/github/sync',
    protectSyncMiddleware,
    async (req, res): Promise<void> => {
      if (syncLocked) {
        res.status(409).json({ error: 'Already syncing' });
        return;
      }

      syncLocked = true;

      try {
        const result = await syncGithubRepositories();
        res.json(result);
      } catch (error) {
        console.error('Failed to sync GitHub repositories:', error);
        res.status(500).json({ error: 'Internal server error' });
      } finally {
        syncLocked = false;
      }
    },
  );

  return router;
};
