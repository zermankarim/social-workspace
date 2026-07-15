import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { ConversationResponseDto } from './conversation.dto';

export const PaginatedConversationsResponseDto = createPaginatedResponseDto(
  ConversationResponseDto,
  'Conversations for the current page',
);
