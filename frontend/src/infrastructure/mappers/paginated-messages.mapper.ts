import { PaginatedMessages } from "@/core/domain/entities/paginated-messages.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PaginatedMessagesResponseDto } from "@/infrastructure/api/dto/conversation-response.dto";
import { ConversationMapper } from "@/infrastructure/mappers/conversation.mapper";

export class PaginatedMessagesMapper {
  static fromApi(dto: PaginatedMessagesResponseDto): PaginatedMessages {
    return new PaginatedMessages(
      dto.data.map((item) => ConversationMapper.messageFromApi(item)),
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
