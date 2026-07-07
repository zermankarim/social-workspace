import { ApiProperty } from '@nestjs/swagger';
import { TodoResponseDto } from './todo.dto';

export class PaginationMetaDto {
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() total: number;
  @ApiProperty() totalPages: number;
  @ApiProperty() hasNextPage: boolean;
  @ApiProperty() hasPrevPage: boolean;
}
export class PaginatedTodosResponseDto {
  @ApiProperty({ type: [TodoResponseDto] })
  data: TodoResponseDto[];
  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
