import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { EmploymentType, WorkplaceType } from '@prisma/client';
import {
  COMPANY_NAME_MAX_LENGTH,
  JOB_TITLE_MAX_LENGTH,
  PROFILE_DESCRIPTION_MAX_LENGTH,
} from '../constants/profile.constants';

export class CreateWorkExperienceDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @MaxLength(JOB_TITLE_MAX_LENGTH)
  title: string;

  @ApiProperty({ enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiProperty({ example: 'Acme Inc.' })
  @IsString()
  @MaxLength(COMPANY_NAME_MAX_LENGTH)
  companyName: string;

  @ApiProperty({ example: '2022-01-01', description: 'ISO date (YYYY-MM-DD)' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    example: '2024-06-01',
    nullable: true,
    description: 'Omit or null if currently working here',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsDateString()
  endDate?: string | null;

  @ApiProperty({ enum: WorkplaceType })
  @IsEnum(WorkplaceType)
  workplaceType: WorkplaceType;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(PROFILE_DESCRIPTION_MAX_LENGTH)
  description?: string | null;
}

export class UpdateWorkExperienceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(JOB_TITLE_MAX_LENGTH)
  title?: string;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(COMPANY_NAME_MAX_LENGTH)
  companyName?: string;

  @ApiPropertyOptional({ example: '2022-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ enum: WorkplaceType })
  @IsOptional()
  @IsEnum(WorkplaceType)
  workplaceType?: WorkplaceType;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(PROFILE_DESCRIPTION_MAX_LENGTH)
  description?: string | null;
}
