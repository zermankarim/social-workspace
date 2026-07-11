import type { PaginatedLikes } from "@/core/domain/entities/paginated-likes.entity";
import type { PostLike } from "@/core/domain/entities/post-like.entity";
import type { PostLikeType } from "@/core/domain/enums/post-like-type.enum";

export abstract class LikeRepository {
  abstract findByPost(
    postId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedLikes>;
  abstract upsert(postId: string, likeType: PostLikeType): Promise<PostLike>;
  abstract remove(postId: string): Promise<void>;
}
