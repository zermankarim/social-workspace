import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export enum TodoOrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export enum TodoSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class TodoQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: TodoSortBy,
    description: 'Field to sort by',
    default: TodoSortBy.CREATED_AT,
    example: TodoSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(TodoSortBy)
  sortBy?: TodoSortBy = TodoSortBy.CREATED_AT;

  @ApiPropertyOptional({
    enum: TodoOrderBy,
    description: 'Sort direction',
    default: TodoOrderBy.DESC,
    example: TodoOrderBy.DESC,
  })
  @IsOptional()
  @IsEnum(TodoOrderBy)
  orderBy?: TodoOrderBy = TodoOrderBy.DESC;

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'example',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
