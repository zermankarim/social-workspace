import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { CommentResponseDto } from './comment.dto';

export const PaginatedCommentsResponseDto = createPaginatedResponseDto(
  CommentResponseDto,
  'Comments for the current page',
);
