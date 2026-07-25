import { Prisma } from '@prisma/client';

const jobPosterSelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  headline: true,
} as const satisfies Prisma.UserSelect;

const jobCompanySelect = {
  id: true,
  name: true,
  logoUrl: true,
} as const satisfies Prisma.CompanySelect;

export const jobSelect = {
  id: true,
  title: true,
  companyName: true,
  companyId: true,
  company: { select: jobCompanySelect },
  location: true,
  description: true,
  applyUrl: true,
  employmentType: true,
  workplaceType: true,
  experienceLevel: true,
  createdAt: true,
  updatedAt: true,
  poster: { select: jobPosterSelect },
  _count: { select: { applications: true } },
} as const satisfies Prisma.JobSelect;

export type JobSelected = Prisma.JobGetPayload<{ select: typeof jobSelect }>;
