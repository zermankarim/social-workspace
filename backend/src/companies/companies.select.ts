import { Prisma } from '@prisma/client';

export const companyEmployeeSelect = {
  userId: true,
  title: true,
  endDate: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      headline: true,
    },
  },
} as const satisfies Prisma.WorkExperienceSelect;

export type CompanyEmployeeSelected = Prisma.WorkExperienceGetPayload<{
  select: typeof companyEmployeeSelect;
}>;
