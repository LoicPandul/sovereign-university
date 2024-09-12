// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

import { Level } from './resource.js';
import { JoinedTutorialLight } from './tutorial.js';
export interface FullProfessor {
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
  picture: string;
  coursesCount: number;
  tutorialsCount: number;
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
  courses: {
    id: string;
    hours: number;
    topic: string;
    subtopic: string;
    originalLanguage: string;
    requiresPayment: boolean;
    paidPriceDollars: number | null;
    paidDescription: string | null;
    paidVideoLink: string | null;
    paidStartDate: Date | null;
    paidEndDate: Date | null;
    contact: string | null;
    lastUpdated: Date;
    lastCommit: string;
    language: string;
    name: string;
    goal: string;
    objectives: string[];
    rawDescription: string;
    level: Level;
    chaptersCount?: number | undefined;
    professors: {
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
      picture: string;
      coursesCount: number;
      tutorialsCount: number;
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
    }[];
  }[];
  tutorials: JoinedTutorialLight[];
}
