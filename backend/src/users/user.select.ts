import { Prisma } from '@prisma/client';

export const userPublicSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  firstName: true,
  lastName: true,
  headline: true,
  bio: true,
  location: true,
  avatarUrl: true,
  coverUrl: true,
  preferredLocale: true,
  github: true,
  linkedin: true,
  website: true,
  twitter: true,
} as const satisfies Prisma.UserSelect;

export type UserPublic = Prisma.UserGetPayload<{
  select: typeof userPublicSelect;
}>;

export const skillSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.SkillSelect;

export type SkillSelected = Prisma.SkillGetPayload<{
  select: typeof skillSelect;
}>;

export const languageSelect = {
  id: true,
  code: true,
  nameEn: true,
  nameRu: true,
} as const satisfies Prisma.LanguageSelect;

export type LanguageSelected = Prisma.LanguageGetPayload<{
  select: typeof languageSelect;
}>;

export const workExperienceSelect = {
  id: true,
  userId: true,
  title: true,
  employmentType: true,
  companyName: true,
  startDate: true,
  endDate: true,
  workplaceType: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.WorkExperienceSelect;

export type WorkExperienceSelected = Prisma.WorkExperienceGetPayload<{
  select: typeof workExperienceSelect;
}>;

export const educationSelect = {
  id: true,
  userId: true,
  schoolName: true,
  degree: true,
  startDate: true,
  endDate: true,
  description: true,
  gradePoint: true,
  createdAt: true,
  updatedAt: true,
  skills: {
    select: {
      skill: { select: skillSelect },
    },
  },
} as const satisfies Prisma.EducationSelect;

export type EducationSelected = Prisma.EducationGetPayload<{
  select: typeof educationSelect;
}>;

export const userLanguageSelect = {
  id: true,
  userId: true,
  proficiency: true,
  createdAt: true,
  updatedAt: true,
  language: { select: languageSelect },
} as const satisfies Prisma.UserLanguageSelect;

export type UserLanguageSelected = Prisma.UserLanguageGetPayload<{
  select: typeof userLanguageSelect;
}>;

export const userProfileSelect = {
  ...userPublicSelect,
  experiences: {
    select: workExperienceSelect,
    orderBy: { startDate: 'desc' as const },
  },
  educations: {
    select: educationSelect,
    orderBy: { startDate: 'desc' as const },
  },
  languages: {
    select: userLanguageSelect,
    orderBy: { createdAt: 'asc' as const },
  },
  skills: {
    select: {
      skill: { select: skillSelect },
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const satisfies Prisma.UserSelect;

export type UserProfileSelected = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;
