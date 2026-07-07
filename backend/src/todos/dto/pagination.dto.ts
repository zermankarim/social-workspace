import { ApiProperty } from '@nestjs/swagger';
import { TodoResponseDto } from './todo.dto';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Current page (1-based)',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of todos for the user',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether a next page exists',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether a previous page exists',
    example: false,
  })
  hasPrevPage: boolean;
}

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
