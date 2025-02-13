import {
  createSyncCdnRepository,
  createSyncRepositories,
  timeLog,
} from '@blms/github';
import {
  createCalculateCourseChapterSeats,
  createCalculateEventSeats,
  createGetNow,
  createProcessContentFiles,
  createProcessDeleteOldEntities,
  createProcessDisableOldEntities,
  createSyncEventsLocations,
  createSyncProjectsLocations,
} from '@blms/service-content';

import type { Dependencies } from '#src/dependencies.js';

export function createSyncGithubRepositories(dependencies: Dependencies) {
  const config = dependencies.config.sync;

  const getNow = createGetNow(dependencies);
  const syncRepositories = createSyncRepositories(config);
  const syncCdnRepository = createSyncCdnRepository(config.cdnPath);
  const calculateCourseChapterSeats =
    createCalculateCourseChapterSeats(dependencies);
  const calculateEventSeats = createCalculateEventSeats(dependencies);
  const syncEventsLocations = createSyncEventsLocations(dependencies);
  const syncProjectsLocations = createSyncProjectsLocations(dependencies);
  const processContentFiles = createProcessContentFiles(dependencies);
  const processDeleteOldEntities = createProcessDeleteOldEntities(dependencies);
  const processDisableOldEntities =
    createProcessDisableOldEntities(dependencies);

  return async () => {
    const databaseTime = await getNow();
    if (!databaseTime) {
      return { success: false };
    }

    console.time('-- Sync');
    console.log('-- Sync: START ===================================');

    if (!config.publicRepositoryUrl) {
      throw new Error('DATA_REPOSITORY_URL is not defined');
    }

    const timeGetAllRepoFiles = timeLog('Loading content files');
    const context = await syncRepositories();
    timeGetAllRepoFiles();

    console.log('-- Sync: UPDATE DATABASE =========================');

    const syncErrors: string[] = [];
    const syncWarnings: string[] = [];

    // Process content files
    {
      const timeProcessContentFiles = timeLog('Processing content files');
      const { errors, warnings } = await processContentFiles(
        context.files,
        context.assets,
      );
      syncErrors.push(...errors);
      syncWarnings.push(...warnings);
      timeProcessContentFiles();
    }

    console.log('-- Sync: Calculate remaining seats');
    await calculateCourseChapterSeats();
    await calculateEventSeats();

    await syncEventsLocations(syncWarnings);

    await syncProjectsLocations(syncWarnings);

    if (syncErrors.length > 0) {
      console.error(
        `=== ${syncErrors.length} ERRORS occurred during the sync process: `,
      );
      console.error(syncErrors.join('\n'));
    }

    console.log('-- Sync: UPDATE ASSETS ===========================');

    let privateCdnError: any;
    if (context.privateGit) {
      const timeSync = timeLog('Syncing private CDN repository');
      try {
        await syncCdnRepository(context.privateRepoDir, context.privateGit);
      } catch (error) {
        console.error(error);
        privateCdnError =
          error instanceof Error ? error.message : new Error('Unknown error');
      }
      timeSync();
    }

    let publicCdnError: any;
    {
      const timeSync = timeLog('Syncing public CDN repository');
      try {
        await syncCdnRepository(context.publicRepoDir, context.publicGit);
      } catch (error) {
        console.error(error);
        publicCdnError =
          error instanceof Error ? error.message : new Error('Unknown error');
      }
      timeSync();
    }

    console.log('-- Sync: CLEAR ==================================');

    if (syncErrors.length === 0) {
      await processDeleteOldEntities(databaseTime.now, syncErrors);
      await processDisableOldEntities(databaseTime.now, syncErrors);
    }

    console.timeEnd('-- Sync');
    console.log('-- Sync: END ====================================');

    return {
      success: syncErrors.length === 0,
      syncWarnings: syncWarnings.length > 0 ? syncWarnings : undefined,
      syncErrors: syncErrors.length > 0 ? syncErrors : undefined,
      publicCdnError: publicCdnError,
      privateCdnError: privateCdnError,
    };
  };
}
