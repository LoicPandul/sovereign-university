import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import {
  careerCompanySizeEnum,
  careerLanguageLevelEnum,
  careerRemoteEnum,
  careerRoleLevelEnum,
  jobCategoryEnum,
  jobNameEnum,
  usersCareerLanguages,
  usersCareerProfiles,
  usersCareerRoles,
  usersJobTitles,
  usersLanguages,
} from '@blms/database';

export const careerLanguageLevelSchema = z.enum(
  careerLanguageLevelEnum.enumValues,
);
export const careerRoleLevelSchema = z.enum(careerRoleLevelEnum.enumValues);
export const careerCompanySizeSchema = z.enum(careerCompanySizeEnum.enumValues);
export const careerRemoteSchema = z.enum(careerRemoteEnum.enumValues); //
export const jobNameSchema = z.enum(jobNameEnum.enumValues);
export const jobCategorySchema = z.enum(jobCategoryEnum.enumValues);

export const careerLanguageSchema = createSelectSchema(usersCareerLanguages);
export const careerProfileSchema = createSelectSchema(usersCareerProfiles);
export const careerRoleSchema = createSelectSchema(usersCareerRoles);

export const languageSchema = createSelectSchema(usersLanguages);
export const jobTitleSchema = createSelectSchema(usersJobTitles);

export const joinedCareerProfileSchema = careerProfileSchema.merge(
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
    companySizes: careerCompanySizeSchema.array(),
  }),
);
