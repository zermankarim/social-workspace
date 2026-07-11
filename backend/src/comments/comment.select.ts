import { Prisma } from '@prisma/client';

export const commentSelect = {
  id: true,
  textContent: true,
  postId: true,
  createdAt: true,
  updatedAt: true,
  attachments: true,
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      bio: true,
      role: true,
    },
  },
} as const satisfies Prisma.PostCommentSelect;

export type CommentSelected = Prisma.PostCommentGetPayload<{
  select: typeof commentSelect;
}>;
