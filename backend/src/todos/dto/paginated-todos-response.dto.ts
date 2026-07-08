import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../shared/dto/paginated-response.dto';
import { TodoResponseDto } from './todo.dto';

export class PaginatedTodosResponseDto {
  @ApiProperty({
    type: [TodoResponseDto],
    description: 'Todos for the current page',
  })
  data: TodoResponseDto[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: 'Pagination metadata',
  })
  meta: PaginationMetaDto;
}
