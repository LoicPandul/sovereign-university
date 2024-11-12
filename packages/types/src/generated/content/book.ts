// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

import { Level } from './resource.js';
export interface Book {
  resourceId: number;
  level: string | null;
  author: string;
  websiteUrl: string | null;
  originalLanguage: string;
}

export interface BookLocalized {
  bookId: number;
  language: string;
  original: boolean;
  title: string;
  translator: string | null;
  description: string | null;
  publisher: string | null;
  publicationYear: number | null;
  cover: string | null;
  summaryText: string | null;
  summaryContributorId: string | null;
  shopUrl: string | null;
  downloadUrl: string | null;
}

export interface JoinedBook {
  id: number;
  path: string;
  lastUpdated: Date;
  lastCommit: string;
  author: string;
  websiteUrl: string | null;
  language: string;
  title: string;
  translator: string | null;
  description: string | null;
  publisher: string | null;
  publicationYear: number | null;
  cover: string | null;
  summaryText: string | null;
  summaryContributorId: string | null;
  shopUrl: string | null;
  downloadUrl: string | null;
  original: boolean;
  level: Level;
  tags: string[];
}
