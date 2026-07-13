import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { ConnectionUser } from "@/core/domain/entities/connection-user.entity";

/** Person projection returned by user search (same shape as connection user). */
export type UserSearchResult = ConnectionUser;

export class PaginatedUserSearch {
  constructor(
    public readonly data: UserSearchResult[],
    public readonly meta: PaginationMeta,
  ) {}
}
