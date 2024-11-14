export { trpc } from './trpc.ts';

let customCdnUrl = window.localStorage.getItem('cdnUrl');

Object.defineProperty(window, 'setCustomCdnUrl', {
  value: (url: string) => {
    window.localStorage.setItem('cdnUrl', (customCdnUrl = url));
  },
});

export const cdnUrl = (commitHash: string, path: string) => {
  return customCdnUrl
    ? `${customCdnUrl}/${commitHash}/${path}`
    : `/cdn/${commitHash}/${path}`;
};

/**
 * Content asset URL
 */
export const assetUrl = (commitHash: string, contentPath: string, assetPath: string | null) => {
  return cdnUrl(commitHash, `${contentPath}/assets/${assetPath}`);
};

export const compose = (...args: string[]) => args.join(' ');
