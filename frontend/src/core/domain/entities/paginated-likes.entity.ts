import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PostLike } from "@/core/domain/entities/post-like.entity";

export class PaginatedLikes {
  constructor(
    public readonly data: PostLike[],
    public readonly meta: PaginationMeta,
  ) {}
}
