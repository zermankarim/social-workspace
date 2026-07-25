import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { JobApplicationStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class PaginatedJobApplicationsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: JobApplicationStatus })
  @IsOptional()
  @IsEnum(JobApplicationStatus)
  status?: JobApplicationStatus;
}
