import { PaginatedConversations } from "@/core/domain/entities/paginated-conversations.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PaginatedConversationsResponseDto } from "@/infrastructure/api/dto/conversation-response.dto";
import { ConversationMapper } from "@/infrastructure/mappers/conversation.mapper";

export class PaginatedConversationsMapper {
  static fromApi(
    dto: PaginatedConversationsResponseDto,
  ): PaginatedConversations {
    return new PaginatedConversations(
      dto.data.map((item) => ConversationMapper.fromApi(item)),
      new PaginationMeta(
        dto.meta.page,
        dto.meta.limit,
        dto.meta.total,
        dto.meta.totalPages,
        dto.meta.hasNextPage,
        dto.meta.hasPrevPage,
      ),
    );
  }
}
