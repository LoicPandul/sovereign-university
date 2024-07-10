// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

export interface GlossaryWord {
  resourceId: number;
  originalWord: string;
  fileName: string;
  relatedWords?: (string[] | undefined) | null;
}

export interface GlossaryWordLocalized {
  glossaryWordId: number;
  language: string;
  term: string;
  definition: string;
}

export interface JoinedGlossaryWord {
  id: number;
  path: string;
  lastUpdated: Date;
  lastCommit: string;
  originalWord: string;
  fileName: string;
  relatedWords?: (string[] | undefined) | null;
  language: string;
  term: string;
  definition: string;
  tags?: string[] | undefined;
}
