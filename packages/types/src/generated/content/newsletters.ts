// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

export interface Newsletter {
  resourceId: number;
  id: string;
  level: string | null;
  author: string;
  websiteUrl: string | null;
  publication_date: string | null;
  title: string;
  tags: string[] | null;
  contributors: string[] | null;
  language: string;
  description: string | null;
}

export interface JoinedNewsletter {
  path: string;
  lastUpdated: Date;
  lastCommit: string;
  author: string;
  websiteUrl: string | null;
  level: string | null;
  language: string;
  description: string | null;
  resourceId: number;
  id?: string | undefined;
  tags: string[];
  contributors: string[];
  title: string;
  publication_date?: string | undefined;
}
