import type { Hashtag } from "@/core/domain/entities/hashtag.entity";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

export class PaginatedHashtags {
  constructor(
    public readonly data: Hashtag[],
    public readonly meta: PaginationMeta,
  ) {}
}
