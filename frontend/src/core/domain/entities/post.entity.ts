import type { PostAttachment } from "@/core/domain/entities/post-attachment.entity";
import type { PostAuthor } from "@/core/domain/entities/post-author.entity";

export class Post {
  constructor(
    public readonly id: string,
    public readonly textContent: string | null,
    public readonly author: PostAuthor,
    public readonly attachments: PostAttachment[],
    public readonly likesCount: number,
    public readonly commentsCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isAuthoredBy(userId: string): boolean {
    return this.author.id === userId;
  }
}
