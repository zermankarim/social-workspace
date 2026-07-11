import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PostComment } from "@/core/domain/entities/post-comment.entity";

export class PaginatedComments {
  constructor(
    public readonly data: PostComment[],
    public readonly meta: PaginationMeta,
  ) {}
}
