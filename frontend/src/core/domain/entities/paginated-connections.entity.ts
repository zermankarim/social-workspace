import type { Connection } from "@/core/domain/entities/connection.entity";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

export class PaginatedConnections {
  constructor(
    public readonly data: Connection[],
    public readonly meta: PaginationMeta,
  ) {}
}
