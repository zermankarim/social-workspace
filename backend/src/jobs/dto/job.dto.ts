import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EmploymentType,
  JobExperienceLevel,
  WorkplaceType,
} from '@prisma/client';

export class JobPosterDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;
}

export class JobCompanyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  logoUrl: string | null;
}

export class JobResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Senior Backend Engineer' })
  title: string;

  @ApiProperty({ example: 'Acme Inc.' })
  companyName: string;

  @ApiPropertyOptional({ type: JobCompanyDto, nullable: true })
  company: JobCompanyDto | null;

  @ApiPropertyOptional({ example: 'Remote', nullable: true })
  location: string | null;

  @ApiProperty({ example: 'We are looking for...' })
  description: string;

  @ApiPropertyOptional({
    example: 'https://example.com/careers/123',
    nullable: true,
    description:
      'External application link, if the poster wants one alongside in-app Easy Apply.',
  })
  applyUrl: string | null;

  @ApiPropertyOptional({ enum: EmploymentType, nullable: true })
  employmentType: EmploymentType | null;

  @ApiPropertyOptional({ enum: WorkplaceType, nullable: true })
  workplaceType: WorkplaceType | null;

  @ApiPropertyOptional({ enum: JobExperienceLevel, nullable: true })
  experienceLevel: JobExperienceLevel | null;

  @ApiProperty({ example: 12 })
  applicationsCount: number;

  @ApiProperty({ type: JobPosterDto })
  poster: JobPosterDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
