// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

export interface Professor {
  id: number;
  path: string;
  name: string;
  company: string | null;
  affiliations: string[] | null;
  contributorId: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  nostr: string | null;
  lightningAddress: string | null;
  lnurlPay: string | null;
  paynym: string | null;
  silentPayment: string | null;
  tipsUrl: string | null;
  lastUpdated: Date;
  lastCommit: string;
  lastSync: Date;
}

export interface ProfessorLocalized {
  professorId: number;
  language: string;
  bio: string | null;
  shortBio: string | null;
}

export interface JoinedProfessor {
  id: number;
  path: string;
  name: string;
  company: string | null;
  affiliations: string[] | null;
  contributorId: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  nostr: string | null;
  lightningAddress: string | null;
  lnurlPay: string | null;
  paynym: string | null;
  silentPayment: string | null;
  tipsUrl: string | null;
  lastUpdated: Date;
  lastCommit: string;
  lastSync: Date;
  language: string;
  bio: string | null;
  shortBio: string | null;
  tags: string[];
  coursesCount: number;
  coursesIds: string[];
  tutorialsCount: number;
  lecturesCount: number;
}

export interface FormattedProfessor {
  id: number;
  path: string;
  name: string;
  company: string | null;
  affiliations: string[] | null;
  contributorId: string;
  lastUpdated: Date;
  lastCommit: string;
  lastSync: Date;
  language: string;
  bio: string | null;
  shortBio: string | null;
  tags: string[];
  coursesCount: number;
  coursesIds: string[];
  tutorialsCount: number;
  lecturesCount: number;
  links: {
    website: string | null;
    twitter: string | null;
    github: string | null;
    nostr: string | null;
  };
  tips: {
    lightningAddress: string | null;
    lnurlPay: string | null;
    paynym: string | null;
    silentPayment: string | null;
    url: string | null;
  };
}
