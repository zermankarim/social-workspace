import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { TodoResponseDto } from './todo.dto';

export const PaginatedTodosResponseDto = createPaginatedResponseDto(
  TodoResponseDto,
  'Todos for the current page',
);
