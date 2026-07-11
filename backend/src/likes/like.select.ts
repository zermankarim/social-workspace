import { Prisma } from '@prisma/client';

export const likeSelect = {
  id: true,
  postId: true,
  likeType: true,
  createdAt: true,
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      bio: true,
    },
  },
} as const satisfies Prisma.PostLikeSelect;

export type LikeSelected = Prisma.PostLikeGetPayload<{
  select: typeof likeSelect;
}>;
