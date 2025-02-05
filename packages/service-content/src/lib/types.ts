import type { ChangedFile } from '@blms/types';

import type { ContentType, Language } from './const.js';

export type ChangedFileWithLanguage = ChangedFile & {
  language?: Language | 'school';
};

export interface ChangedContent {
  type: ContentType;
  path: string;
  fullPath: string;
  main?: ChangedFile;
  files: ChangedFileWithLanguage[];
}

export interface ProofreadingEntry {
  language: string;
  last_contribution_date: string | null;
  urgency: number;
  contributors_id?: string[];
  reward: number;
}
