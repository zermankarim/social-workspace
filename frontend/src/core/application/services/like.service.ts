import type { PaginatedLikes } from "@/core/domain/entities/paginated-likes.entity";
import type { PostLike } from "@/core/domain/entities/post-like.entity";
import type { PostLikeType } from "@/core/domain/enums/post-like-type.enum";
import type { LikeRepository } from "@/core/domain/repositories/like.repository";

export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  getByPost(postId: string, page = 1, limit = 20): Promise<PaginatedLikes> {
    return this.likeRepository.findByPost(postId, page, limit);
  }

  upsert(postId: string, likeType: PostLikeType): Promise<PostLike> {
    return this.likeRepository.upsert(postId, likeType);
  }

  remove(postId: string): Promise<void> {
    return this.likeRepository.remove(postId);
  }
}
