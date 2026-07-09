import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { UserResponseDto } from '../../users/dto/user.dto';

export const PaginatedUsersResponseDto = createPaginatedResponseDto(
  UserResponseDto,
  'Users for the current page',
);
