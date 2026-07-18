import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class PostSearchQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search posts by text content (case-insensitive)',
    example: 'typescript',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
