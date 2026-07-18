import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { HashtagResponseDto } from './hashtag.dto';

export const PaginatedHashtagsResponseDto = createPaginatedResponseDto(
  HashtagResponseDto,
  'Hashtags for the current page',
);
