import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  EmploymentType,
  JobExperienceLevel,
  WorkplaceType,
} from '@prisma/client';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

export class PaginatedJobsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'backend engineer',
    description: 'Matches job title or description',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 'Berlin' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ enum: WorkplaceType })
  @IsOptional()
  @IsEnum(WorkplaceType)
  workplaceType?: WorkplaceType;

  @ApiPropertyOptional({ enum: JobExperienceLevel })
  @IsOptional()
  @IsEnum(JobExperienceLevel)
  experienceLevel?: JobExperienceLevel;
}
