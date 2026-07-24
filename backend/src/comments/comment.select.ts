import { Prisma } from '@prisma/client';

const commentAuthorSelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  headline: true,
  role: true,
} as const satisfies Prisma.UserSelect;

/** Replies never nest further — one level of nesting only. */
const commentReplySelect = {
  id: true,
  textContent: true,
  postId: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
  attachments: true,
  author: { select: commentAuthorSelect },
} as const satisfies Prisma.PostCommentSelect;

export const commentSelect = {
  id: true,
  textContent: true,
  postId: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
  attachments: true,
  author: { select: commentAuthorSelect },
  replies: {
    select: commentReplySelect,
    orderBy: { createdAt: 'asc' },
  },
} as const satisfies Prisma.PostCommentSelect;

export type CommentSelected = Prisma.PostCommentGetPayload<{
  select: typeof commentSelect;
}>;

export type CommentReplySelected = Prisma.PostCommentGetPayload<{
  select: typeof commentReplySelect;
}>;
