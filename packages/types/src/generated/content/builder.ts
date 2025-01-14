// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

export interface BuilderLocation {
  placeId: number;
  name: string;
  lat: number;
  lng: number;
}

export interface Builder {
  resourceId: number;
  name: string;
  category: string;
  languages: string[] | null;
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  originalLanguage: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  nostr: string | null;
}

export interface BuilderLocalized {
  builderId: number;
  language: string;
  description: string | null;
}

export interface JoinedBuilder {
  id: number;
  path: string;
  lastCommit: string;
  name: string;
  category: string;
  languages: string[] | null;
  websiteUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  nostr: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  originalLanguage: string;
  language: string;
  description: string | null;
  tags?: string[] | undefined;
}
