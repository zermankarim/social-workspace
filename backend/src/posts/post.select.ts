import { Prisma } from '@prisma/client';
import { commentSelect } from '../comments/comment.select';
import { likeSelect } from '../likes/like.select';
import {
  POST_PREVIEW_COMMENTS,
  POST_PREVIEW_LIKES,
} from './constants/post.constants';

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
      headline: true,
      role: true,
    },
  },
  comments: {
    take: POST_PREVIEW_COMMENTS,
    orderBy: { createdAt: 'desc' as const },
    select: commentSelect,
  },
  postLikes: {
    take: POST_PREVIEW_LIKES,
    orderBy: { createdAt: 'desc' as const },
    select: likeSelect,
  },
} as const satisfies Prisma.PostSelect;

export type PostSelected = Prisma.PostGetPayload<{
  select: typeof postSelect;
}>;
