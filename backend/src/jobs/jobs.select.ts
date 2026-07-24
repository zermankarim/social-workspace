import { Prisma } from '@prisma/client';

const jobPosterSelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  headline: true,
} as const satisfies Prisma.UserSelect;

export const jobSelect = {
  id: true,
  title: true,
  companyName: true,
  location: true,
  description: true,
  applyUrl: true,
  createdAt: true,
  updatedAt: true,
  poster: { select: jobPosterSelect },
} as const satisfies Prisma.JobSelect;

export type JobSelected = Prisma.JobGetPayload<{ select: typeof jobSelect }>;
