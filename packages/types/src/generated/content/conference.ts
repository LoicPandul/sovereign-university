// @generated
// This file is automatically generated from our schemas by the command `pnpm types:generate`. Do not modify manually.

export interface Conference {
  resourceId: number;
  name: string;
  description: string | null;
  year: string;
  builder: string | null;
  languages: string[] | null;
  location: string;
  originalLanguage: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
}

export interface ConferenceStage {
  stageId: string;
  conferenceId: number;
  name: string;
}

export interface ConferenceStageVideo {
  videoId: string;
  stageId: string;
  name: string;
  rawContent: string;
}

export interface JoinedConferenceStage {
  stageId: string;
  conferenceId: number;
  name: string;
  videos: ConferenceStageVideo[];
}

export interface JoinedConference {
  id: number;
  path: string;
  lastUpdated: Date;
  lastCommit: string;
  name: string;
  description: string | null;
  year: string;
  builder: string | null;
  languages: string[] | null;
  location: string;
  websiteUrl: string | null;
  twitterUrl: string | null;
  stages: JoinedConferenceStage[];
  tags: string[];
}
