import { Prisma } from '@prisma/client';

export const companySelect = {
  id: true,
  name: true,
  tagline: true,
  description: true,
  industry: true,
  size: true,
  foundedYear: true,
  websiteUrl: true,
  headquarters: true,
  logoUrl: true,
  coverUrl: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.CompanySelect;

export type CompanySelected = Prisma.CompanyGetPayload<{
  select: typeof companySelect;
}>;

export const companySummarySelect = {
  id: true,
  name: true,
  logoUrl: true,
  industry: true,
} as const satisfies Prisma.CompanySelect;

export type CompanySummarySelected = Prisma.CompanyGetPayload<{
  select: typeof companySummarySelect;
}>;

export const companyAdminSelect = {
  role: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      headline: true,
    },
  },
} as const satisfies Prisma.CompanyAdminSelect;

export type CompanyAdminSelected = Prisma.CompanyAdminGetPayload<{
  select: typeof companyAdminSelect;
}>;

export const companyServiceSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
} as const satisfies Prisma.CompanyServiceSelect;

export type CompanyServiceSelected = Prisma.CompanyServiceGetPayload<{
  select: typeof companyServiceSelect;
}>;

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
