import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { User } from "@/core/domain/entities/user.entity";

export class PaginatedUsers {
  constructor(
    public readonly data: User[],
    public readonly meta: PaginationMeta,
  ) {}
}
