import { Prisma } from '@prisma/client';

export const followUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  headline: true,
  avatarUrl: true,
  role: true,
} as const satisfies Prisma.UserSelect;

export type FollowUserSelected = Prisma.UserGetPayload<{
  select: typeof followUserSelect;
}>;

export const followSelect = {
  id: true,
  createdAt: true,
  follower: { select: followUserSelect },
  following: { select: followUserSelect },
} as const satisfies Prisma.FollowSelect;

export type FollowSelected = Prisma.FollowGetPayload<{
  select: typeof followSelect;
}>;
