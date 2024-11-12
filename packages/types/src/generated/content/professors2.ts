// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

import { JoinedCourse } from './course.js';
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
  coursesCount: number;
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
  courses: JoinedCourse[];
  tutorials: JoinedTutorialLight[];
}
