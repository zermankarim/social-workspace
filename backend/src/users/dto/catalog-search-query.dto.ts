import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class CatalogSearchQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search query (case-insensitive contains)',
    example: 'eng',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
