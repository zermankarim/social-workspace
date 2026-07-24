import type { Follow } from "@/core/domain/entities/follow.entity";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

export class PaginatedFollows {
  constructor(
    public readonly data: Follow[],
    public readonly meta: PaginationMeta,
  ) {}
}
