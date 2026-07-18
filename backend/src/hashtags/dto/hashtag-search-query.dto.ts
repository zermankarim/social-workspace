import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class HashtagSearchQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search hashtags by prefix/substring (case-insensitive)',
    example: 'hir',
    maxLength: 64,
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  q?: string;
}
