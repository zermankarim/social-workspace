import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class PaginatedReportsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: ReportStatus })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;
}
