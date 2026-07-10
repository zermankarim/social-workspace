import { Prisma } from '@prisma/client';

export const userPublicSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  firstName: true,
  lastName: true,
  bio: true,
  location: true,
  avatarUrl: true,
  github: true,
  linkedin: true,
  website: true,
  twitter: true,
} as const satisfies Prisma.UserSelect;

export type UserPublic = Prisma.UserGetPayload<{
  select: typeof userPublicSelect;
}>;
