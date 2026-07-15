import type { Message } from "@/core/domain/entities/message.entity";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

export class PaginatedMessages {
  constructor(
    public readonly data: Message[],
    public readonly meta: PaginationMeta,
  ) {}
}
