import { Prisma } from '@prisma/client';

export const connectionUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  headline: true,
  avatarUrl: true,
} as const satisfies Prisma.UserSelect;

export type ConnectionUserSelected = Prisma.UserGetPayload<{
  select: typeof connectionUserSelect;
}>;

export const connectionSelect = {
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  requester: { select: connectionUserSelect },
  addressee: { select: connectionUserSelect },
} as const satisfies Prisma.ConnectionSelect;

export type ConnectionSelected = Prisma.ConnectionGetPayload<{
  select: typeof connectionSelect;
}>;
