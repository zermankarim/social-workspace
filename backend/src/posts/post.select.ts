import { Prisma } from '@prisma/client';
import { commentSelect } from '../comments/comment.select';
import { likeSelect } from '../likes/like.select';
import {
  POST_PREVIEW_COMMENTS,
  POST_PREVIEW_LIKES,
} from './constants/post.constants';

const postAuthorSelect = {
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  headline: true,
  role: true,
} as const satisfies Prisma.UserSelect;

/**
 * Lightweight select for the original post embedded inside a repost.
 * Intentionally excludes nested reposts / previews to avoid deep recursion.
 */
const repostOfSelect = {
  id: true,
  textContent: true,
  createdAt: true,
  updatedAt: true,
  commentsCount: true,
  likesCount: true,
  repostsCount: true,
  impressionsCount: true,
  attachments: true,
  author: { select: postAuthorSelect },
} as const satisfies Prisma.PostSelect;

export const postSelect = {
  id: true,
  textContent: true,
  createdAt: true,
  updatedAt: true,
  commentsCount: true,
  likesCount: true,
  repostsCount: true,
  impressionsCount: true,
  attachments: true,
  author: { select: postAuthorSelect },
  repostOf: { select: repostOfSelect },
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

export type RepostOfSelected = Prisma.PostGetPayload<{
  select: typeof repostOfSelect;
}>;
