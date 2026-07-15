import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { MessageResponseDto } from './message.dto';

export const PaginatedMessagesResponseDto = createPaginatedResponseDto(
  MessageResponseDto,
  'Messages for the current page',
);
