import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class UserSearchQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description:
      'Search by first name, last name, or full name (case-insensitive)',
    example: 'John',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
