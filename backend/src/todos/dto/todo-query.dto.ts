import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class TodoQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of todos per page',
    default: 20,
    minimum: 1,
    maximum: 100,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    enum: SortBy,
    description: 'Field to sort by',
    default: SortBy.CREATED_AT,
    example: SortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.CREATED_AT;

  @ApiPropertyOptional({
    enum: OrderBy,
    description: 'Sort direction',
    default: OrderBy.DESC,
    example: OrderBy.DESC,
  })
  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy = OrderBy.DESC;

  @ApiPropertyOptional({
    description: 'Search query',
    example: 'example',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
