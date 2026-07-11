import type { PostAuthor } from "@/core/domain/entities/post-author.entity";
import type { PostLikeType } from "@/core/domain/enums/post-like-type.enum";

export class PostLike {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly likeType: PostLikeType,
    public readonly author: PostAuthor,
    public readonly createdAt: Date,
  ) {}
}
