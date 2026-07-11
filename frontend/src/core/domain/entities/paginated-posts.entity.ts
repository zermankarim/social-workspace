import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { Post } from "@/core/domain/entities/post.entity";

export class PaginatedPosts {
  constructor(
    public readonly data: Post[],
    public readonly meta: PaginationMeta,
  ) {}
}
