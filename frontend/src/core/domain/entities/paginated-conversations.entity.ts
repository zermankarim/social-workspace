import type { Conversation } from "@/core/domain/entities/conversation.entity";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

export class PaginatedConversations {
  constructor(
    public readonly data: Conversation[],
    public readonly meta: PaginationMeta,
  ) {}
}
