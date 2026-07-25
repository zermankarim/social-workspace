import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobApplicationStatus } from '@prisma/client';

export class JobApplicationApplicantDto {
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

export class JobApplicationJobDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  companyName: string;

  @ApiPropertyOptional({ nullable: true })
  companyLogoUrl: string | null;
}

export class JobApplicationResumeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  fileUrl: string;
}

export class JobApplicationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: JobApplicationStatus })
  status: JobApplicationStatus;

  @ApiPropertyOptional({ nullable: true })
  contactEmail: string | null;

  @ApiPropertyOptional({ nullable: true })
  contactPhone: string | null;

  @ApiPropertyOptional({ nullable: true })
  coverNote: string | null;

  @ApiPropertyOptional({ nullable: true })
  decisionReason: string | null;

  @ApiPropertyOptional({ nullable: true })
  decidedAt: Date | null;

  @ApiProperty({ type: JobApplicationApplicantDto })
  applicant: JobApplicationApplicantDto;

  @ApiProperty({ type: JobApplicationJobDto })
  job: JobApplicationJobDto;

  @ApiPropertyOptional({ type: JobApplicationResumeDto, nullable: true })
  resume: JobApplicationResumeDto | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
