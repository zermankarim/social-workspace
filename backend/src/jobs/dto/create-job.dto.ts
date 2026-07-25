import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import {
  EmploymentType,
  JobExperienceLevel,
  WorkplaceType,
} from '@prisma/client';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Backend Engineer', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({
    description:
      'Post on behalf of a registered company page (you must be an admin of it).',
  })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({
    example: 'Acme Inc.',
    maxLength: 150,
    description:
      'Required when companyId is not set; ignored (derived from the company) otherwise.',
  })
  @ValidateIf((dto: CreateJobDto) => !dto.companyId)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  companyName?: string;

  @ApiPropertyOptional({ example: 'Remote', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @ApiProperty({ example: 'We are looking for...', maxLength: 5000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiPropertyOptional({
    example: 'https://example.com/careers/123',
    description: 'Optional external link shown alongside in-app Easy Apply.',
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  applyUrl?: string;

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
