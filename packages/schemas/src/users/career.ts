import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  careerCompanySizeEnum,
  careerLanguageLevelEnum,
  careerRemoteEnum,
  careerRoleLevelEnum,
  jobNameEnum,
  usersCareerCompanySizes,
  usersCareerLanguages,
  usersCareerProfiles,
  usersCareerRoles,
  usersJobTitles,
  usersLanguages,
} from '@blms/database';

export const jobTitleEnumSchema = z.enum(jobNameEnum.enumValues);
export const companySizeSchema = z.enum(careerCompanySizeEnum.enumValues);
export const remoteWorkSchema = z.enum(careerRemoteEnum.enumValues);
export const careerLanguageLevelSchema = z.enum(
  careerLanguageLevelEnum.enumValues,
);
export const careerRoleLevelSchema = z.enum(careerRoleLevelEnum.enumValues);

export const careerCompanySizeSchema = createSelectSchema(
  usersCareerCompanySizes,
);
export const careerLanguageSchema = createSelectSchema(usersCareerLanguages);
export const careerProfileSchema = createSelectSchema(usersCareerProfiles);
export const careerRoleSchema = createSelectSchema(usersCareerRoles);

export const languageSchema = createSelectSchema(usersLanguages);
export const jobTitleSchema = createSelectSchema(usersJobTitles);

export const joinedCareerProfileSchema = careerProfileSchema
  .pick({
    uid: true,
    id: true,
    firstName: true,
    lastName: true,
    country: true,
    email: true,
    linkedin: true,
    github: true,
    telegram: true,
    otherContact: true,
    isBitcoinCommunityParticipant: true,
    bitcoinCommunityText: true,
    isBitcoinProjectParticipant: true,
    bitcoinProjectText: true,
    isAvailableFullTime: true,
    remoteWorkPreference: true,
    expectedSalary: true,
    availabilityStart: true,
    cvUrl: true,
    motivationLetter: true,
    areTermsAccepted: true,
    allowReceivingEmails: true,
    createdAt: true,
    editedAt: true,
  })
  .merge(
    z.object({
      languages: careerLanguageSchema
        .pick({
          languageCode: true,
          level: true,
        })
        .array(),
      roles: careerRoleSchema
        .pick({
          roleId: true,
          level: true,
        })
        .array(),
      companySizes: companySizeSchema.array(),
    }),
  );
