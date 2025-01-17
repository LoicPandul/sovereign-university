import { copyFileSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { SimpleGit } from 'simple-git';
import { ResetMode, simpleGit } from 'simple-git';

import type { ChangedFile, GitHubSyncConfig } from '@blms/types';

export const timeLog = (str: string) => {
  const key = `-- Sync procedure: ${str}`;
  console.log(key + '...');
  console.time(key);

  return () => {
    console.timeEnd(key);
  };
};

const extractRepositoryFromUrl = (url: string) => {
  return url.split('/').splice(-1)[0].replace('.git', '');
};

const computeSyncDirectory = (syncPath: string, url: string) => {
  return path.join(syncPath, extractRepositoryFromUrl(url));
};

interface LsFile {
  hash: string;
  path: string;
}

type SyncSate = Record<string, { assets: LsFile[] }>;

async function loadJson<T>(path: string): Promise<T | null> {
  if (!existsSync(path)) {
    return null;
  }

  const data = await readFile(path, 'utf8');

  return JSON.parse(data) as T;
}

async function saveJson<T>(path: string, data: T) {
  await writeFile(path, JSON.stringify(data, null, 2));
}

/**
 * @param repository - Directory path to the repository (sync)
 * @param branch     - Branch to sync
 * @param directory  - Directory to sync the repository to (cdn)
 * @param githubAccessToken - Token to access the repository (if private)
 * @returns a simple-git instance
 */
const syncRepository = async (
  repository: string,
  branch: string,
  directory: string,
  githubAccessToken?: string,
) => {
  const directoryBranch = await simpleGit()
    .cwd(directory)
    .branchLocal()
    .then((branches) => branches.current)
    .catch(() => null);

  // Clone the repository if it does not exist locally or if the branch is different
  if (directoryBranch !== branch) {
    const options: Record<string, string> = {
      '--depth': '1',
      '--branch': branch,
    };

    // Add authentication header if provided
    if (githubAccessToken) {
      const header = `AUTHORIZATION: basic ${Buffer.from(githubAccessToken).toString('base64')}`;
      options['--config'] = `http.${repository}.extraheader=${header}`;
    }

    const timeClone = timeLog(`Cloning repository on branch ${branch}`);

    // If the directory already exists, remove it (should not happen in production)
    if (directoryBranch || existsSync(directory)) {
      console.warn(
        `[WARN] Directory already synced on branch ${directoryBranch}, removing it`,
      );
      await rm(directory, { recursive: true });
    }

    try {
      const git = simpleGit();
      await git.clone(repository, directory, options);
      await git.cwd(directory);

      console.log(`-- Sync procedure: Cloned repository on branch ${branch}`);
      timeClone();

      return git;
    } catch (error: unknown) {
      console.warn(
        '[WARN] Failed to clone the repo, will try fetch and pull',
        error instanceof Error ? error.message : '',
      );

      throw new Error(
        `Failed to sync repository ${repository}. ${
          error instanceof Error ? error.message : ''
        }`,
      );
    }
  }

  const timePull = timeLog(`Pulling changes on branch ${branch}`);

  // Pull changes if the branch already exists
  try {
    const git = simpleGit(directory);
    await git.reset(ResetMode.HARD); // Reset local changes
    await git.fetch('origin', branch);

    // Get the current branch (commit is a shortened hash)
    const currentBranch = await git
      .branchLocal()
      .then(({ current, branches }) => branches[current]);

    // Full commit hash of the remote branch
    const remoteHash = await git.revparse([`origin/${branch}`]);

    if (remoteHash.startsWith(currentBranch.commit)) {
      console.log(`-- Sync procedure: Branch ${branch} is up to date`);
    } else {
      await git.pull('origin', branch);
    }

    timePull();

    return git;
  } catch (error: unknown) {
    throw new Error(
      `Failed to sync repository ${repository}. ${
        error instanceof Error ? error.message : ''
      }`,
    );
  }
};

/**
 * List all files in a repository
 *
 * @param git - SimpleGit instance
 * @param pattern - Patterns to exclude, defaults to hidden files
 * @returns a list of files in the repository
 */
async function listFiles(git: SimpleGit, pattern = [':!.*']) {
  const files = await git.raw([
    'ls-files',
    '-z',
    '--format=%(objectname) %(path)',
    ...pattern,
  ]);

  const reg = /^(?<hash>[\da-f]+) (?<path>.*)$/;

  // Filter out empty strings and hidden files
  return files
    .split('\0')
    .map((f) => reg.exec(f)?.groups as LsFile | undefined)
    .filter((obj): obj is LsFile => !!obj?.path && !obj.path.startsWith('.'));
}

/**
 * List and load (read) all content (non-assets) files in a repository
 */
async function loadRepoContentFiles(
  repoDir: string,
  git: SimpleGit,
): Promise<ChangedFile[]> {
  const timeReadFilesTotal = timeLog(`Reading files in ${repoDir}`);

  const timeListFiles = timeLog(`Listing files in ${repoDir}`);
  const fileList = await listFiles(git, [':!.*', ':!:*assets*']);
  timeListFiles();

  const timeRead = timeLog(`Reading ${fileList.length} files`);

  const files = fileList.map((file) => {
    const filePath = path.join(repoDir, file.path);

    return {
      path: file.path,
      commit: file.hash,
      time: statSync(filePath).mtimeMs,
      load: () => readFile(filePath),
    };
  });

  timeRead();
  timeReadFilesTotal();

  return files;
}

/**
 * Factory to sync the repositories (clone or pull) and reads all content (non-assets) files
 *
 * @param options - Configuration options
 * @returns a function that syncs the repository and reads all content files
 */
export const createSyncRepositories = (options: GitHubSyncConfig) => {
  return async () => {
    console.log(
      '-- Sync procedure: Syncing the public github repository on branch',
      options.publicRepositoryBranch,
    );

    try {
      const publicRepoDir = computeSyncDirectory(
        options.syncPath,
        options.publicRepositoryUrl,
      );

      const publicGit = await syncRepository(
        options.publicRepositoryUrl,
        options.publicRepositoryBranch,
        publicRepoDir,
      );

      // Read all the files
      const publicFiles = await loadRepoContentFiles(publicRepoDir, publicGit);

      if (options.privateRepositoryUrl && options.githubAccessToken) {
        console.log(
          '-- Sync procedure: Syncing the private github repository on branch',
          options.privateRepositoryBranch,
        );

        const privateRepoDir = computeSyncDirectory(
          options.syncPath,
          options.privateRepositoryUrl,
        );

        const privateGit = await syncRepository(
          options.privateRepositoryUrl,
          options.privateRepositoryBranch,
          privateRepoDir,
          options.githubAccessToken,
        );

        // Read all the files
        const privateFiles = await loadRepoContentFiles(
          privateRepoDir,
          privateGit,
        );

        return {
          files: [...publicFiles, ...privateFiles],
          publicGit,
          publicRepoDir,
          privateGit,
          privateRepoDir,
        };
      }

      return {
        files: publicFiles,
        publicGit,
        publicRepoDir,
      };
    } catch (error) {
      throw new Error(`Failed to clone and read all repo files: ${error}`);
    }
  };
};

/**
 * Sync repository assets
 *
 * @param options - Configuration options
 * @param options.syncPath - Path to sync the repository
 * @param options.cdnPath - Path to sync the repository to
 */
export const createSyncCdnRepository = (cdnPath: string) => {
  const syncSatePath = path.join(cdnPath, 'sync-state.json');

  return async (repositoryDirectory: string, git: SimpleGit) => {
    try {
      const timeListFiles = timeLog(`Listing files in ${repositoryDirectory}`);

      const assets = await listFiles(git, [':!.*', ':*assets*', ':*soon*']);
      timeListFiles();

      let delCount = 0;
      let copyCount = 0;
      let skipCount = 0;
      const timeAssetSync = timeLog(
        `Syncing ${assets.length} assets to the CDN`,
      );

      const state = await loadJson<SyncSate>(syncSatePath);
      const previousState = new Map(
        (state?.[repositoryDirectory]?.assets ?? []).map(({ path, hash }) => [
          path,
          hash,
        ]),
      );

      for (const asset of assets) {
        if (previousState.get(asset.path) === asset.hash) {
          previousState.delete(asset.path);
          skipCount += 1;
          continue;
        }

        previousState.delete(asset.path);

        const relativePath = asset.path.replace(`${repositoryDirectory}/`, '');
        const computedCdnPath = path.join(cdnPath, relativePath);

        // Create the directory if it does not exist
        const cdnDir = path.dirname(computedCdnPath);
        if (!existsSync(cdnDir)) {
          mkdirSync(cdnDir, { recursive: true });
        }

        // Copy the file to the CDN directory
        const absolutePath = path.join(repositoryDirectory, asset.path);
        copyFileSync(absolutePath, computedCdnPath);
        copyCount += 1;
      }

      // Delete files that are no longer in the repository from the CDN directory
      for (const [assetPath] of previousState) {
        const relativePath = assetPath.replace(`${repositoryDirectory}/`, '');
        const computedCdnPath = path.join(cdnPath, relativePath);

        if (existsSync(computedCdnPath)) {
          delCount += 1;
          rmSync(computedCdnPath);
        }
      }

      timeAssetSync();

      console.log(
        `-- Sync procedure: Copied ${copyCount} assets to the CDN (${skipCount} skipped, ${delCount} deleted)`,
      );

      // Save the sync state
      await saveJson(
        syncSatePath,
        Object.assign({}, state, { [repositoryDirectory]: { assets } }),
      );
    } catch (error) {
      throw new Error(`Failed to sync CDN repository: ${error}`);
    }
  };
};
