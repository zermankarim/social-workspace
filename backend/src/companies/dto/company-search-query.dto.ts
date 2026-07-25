import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class CompanySearchQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'acme' })
  @IsOptional()
  @IsString()
  q?: string;
}
