import { Prisma } from '@prisma/client';

export const userPublicSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type UserPublic = Prisma.UserGetPayload<{
  select: typeof userPublicSelect;
}>;
