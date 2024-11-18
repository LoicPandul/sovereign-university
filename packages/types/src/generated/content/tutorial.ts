// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

import { JoinedProfessor } from './professor.js';
import { FormattedProfessor } from './professor.js';
export interface Tutorial {
  id: string;
  path: string;
  name: string;
  category: string;
  subcategory: string | null;
  originalLanguage: string;
  level: string;
  builder: string | null;
  lastUpdated: Date;
  lastCommit: string;
  lastSync: Date;
}

export interface TutorialLocalized {
  tutorialId: string;
  language: string;
  title: string;
  description: string | null;
  rawContent: string;
}

export interface TutorialCredit {
  tutorialId: string;
  contributorId: string | null;
  name: string | null;
  link: string | null;
  lightningAddress: string | null;
  lnurlPay: string | null;
  paynym: string | null;
  silentPayment: string | null;
  tipsUrl: string | null;
}

export interface TutorialLikeDislike {
  tutorialId: string;
  uid: string;
  liked: boolean;
}

export interface JoinedTutorialLight {
  id: string;
  path: string;
  name: string;
  level: string;
  category: string;
  subcategory: string | null;
  originalLanguage: string;
  lastUpdated: Date;
  lastCommit: string;
  language: string;
  title: string;
  description: string | null;
  likeCount: number;
  dislikeCount: number;
  tags: string[];
  builder?:
    | (
        | {
            lastCommit: string;
            path: string;
          }
        | undefined
      )
    | null;
}

export interface JoinedTutorial {
  id: string;
  path: string;
  name: string;
  level: string;
  category: string;
  subcategory: string | null;
  originalLanguage: string;
  lastUpdated: Date;
  lastCommit: string;
  language: string;
  title: string;
  description: string | null;
  likeCount: number;
  dislikeCount: number;
  tags: string[];
  builder?:
    | (
        | {
            lastCommit: string;
            path: string;
          }
        | undefined
      )
    | null;
  rawContent: string;
}

export interface JoinedTutorialCredit {
  tutorialId: string;
  contributorId: string | null;
  name: string | null;
  link: string | null;
  lightningAddress: string | null;
  lnurlPay: string | null;
  paynym: string | null;
  silentPayment: string | null;
  tipsUrl: string | null;
  professor?: JoinedProfessor | undefined;
}

export interface TutorialWithProfessorName {
  id: string;
  path: string;
  name: string;
  category: string;
  subcategory: string | null;
  language: string;
  title: string;
  likeCount: number;
  dislikeCount: number;
  professorName: string | null;
  professorId: number | null;
}

export interface GetTutorialResponse {
  id: string;
  path: string;
  name: string;
  level: string;
  category: string;
  subcategory: string | null;
  originalLanguage: string;
  lastUpdated: Date;
  lastCommit: string;
  language: string;
  title: string;
  description: string | null;
  likeCount: number;
  dislikeCount: number;
  tags: string[];
  builder?:
    | (
        | {
            lastCommit: string;
            path: string;
          }
        | undefined
      )
    | null;
  rawContent: string;
  credits?:
    | {
        name: string | null;
        link: string | null;
        professor?: FormattedProfessor | undefined;
        tips: {
          lightningAddress: string | null;
          lnurlPay: string | null;
          paynym: string | null;
          silentPayment: string | null;
          url: string | null;
        };
      }
    | undefined;
}
