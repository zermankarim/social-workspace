import { Prisma } from '@prisma/client';

//TODO: Add comments and likes preview to the post select
export const postSelect = {
  id: true,
  textContent: true,
  createdAt: true,
  updatedAt: true,
  commentsCount: true,
  likesCount: true,
  attachments: true,
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      bio: true,
    },
  },
} as const satisfies Prisma.PostSelect;

export type PostSelected = Prisma.PostGetPayload<{
  select: typeof postSelect;
}>;
