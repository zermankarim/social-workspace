import type { PostAttachment } from "@/core/domain/entities/post-attachment.entity";
import type { PostAuthor } from "@/core/domain/entities/post-author.entity";
import type { PostComment } from "@/core/domain/entities/post-comment.entity";
import type { PostLike } from "@/core/domain/entities/post-like.entity";
import { PostStatus } from "@/core/domain/enums/post-status.enum";

export class Post {
  constructor(
    public readonly id: string,
    public readonly textContent: string | null,
    public readonly author: PostAuthor,
    public readonly attachments: PostAttachment[],
    public readonly likesCount: number,
    public readonly commentsCount: number,
    public readonly repostsCount: number,
    public readonly impressionsCount: number,
    public readonly previewLikes: PostLike[],
    public readonly previewComments: PostComment[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    /** Original post when this entry is a repost (optional quote in textContent). */
    public readonly repostOf: Post | null = null,
    public readonly status: PostStatus = PostStatus.PUBLISHED,
    public readonly scheduledFor: Date | null = null,
  ) {}

  isAuthoredBy(userId: string): boolean {
    return this.author.id === userId;
  }

  get isDraft(): boolean {
    return this.status === PostStatus.DRAFT;
  }

  get isScheduled(): boolean {
    return this.status === PostStatus.SCHEDULED;
  }

  findLikeByAuthor(userId: string): PostLike | null {
    return this.previewLikes.find((like) => like.author.id === userId) ?? null;
  }

  get isRepost(): boolean {
    return this.repostOf !== null;
  }

  /** True for a plain repost (shares an original with no added quote). */
  get isPlainRepost(): boolean {
    return this.isRepost && !this.textContent?.trim();
  }
}
