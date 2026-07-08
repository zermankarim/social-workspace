import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Total number of items',
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

export type PaginatedResponseDto<T> = {
  data: T[];
  meta: PaginationMetaDto;
};
