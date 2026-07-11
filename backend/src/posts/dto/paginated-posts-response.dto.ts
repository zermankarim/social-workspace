import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { PostResponseDto } from './post.dto';

export const PaginatedPostsResponseDto = createPaginatedResponseDto(
  PostResponseDto,
  'Posts for the current page',
);
