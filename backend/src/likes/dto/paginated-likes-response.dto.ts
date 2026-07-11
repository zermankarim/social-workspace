import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { LikeResponseDto } from './like.dto';

export const PaginatedLikesResponseDto = createPaginatedResponseDto(
  LikeResponseDto,
  'Likes for the current page',
);
