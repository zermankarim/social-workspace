import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { FollowResponseDto } from './follow.dto';

export const PaginatedFollowsResponseDto = createPaginatedResponseDto(
  FollowResponseDto,
  'Follow relationships for the current page',
);
