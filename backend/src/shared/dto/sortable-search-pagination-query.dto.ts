import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  PaginationOrderBy,
  PaginationSortBy,
} from '../enums/pagination.enum';
import { PaginationQueryDto } from './pagination-query.dto';

export class SortableSearchPaginationQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: PaginationSortBy,
    description: 'Field to sort by',
    default: PaginationSortBy.CREATED_AT,
    example: PaginationSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(PaginationSortBy)
  sortBy?: PaginationSortBy = PaginationSortBy.CREATED_AT;

  @ApiPropertyOptional({
    enum: PaginationOrderBy,
    description: 'Sort direction',
    default: PaginationOrderBy.DESC,
    example: PaginationOrderBy.DESC,
  })
  @IsOptional()
  @IsEnum(PaginationOrderBy)
  orderBy?: PaginationOrderBy = PaginationOrderBy.DESC;

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'example',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
