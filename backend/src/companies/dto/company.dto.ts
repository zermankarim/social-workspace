import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyAdminRole, CompanySize } from '@prisma/client';

export class CompanyEmployeeDto {
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

  @ApiProperty({ description: 'Their job title at this company' })
  title: string;

  @ApiProperty()
  isCurrent: boolean;
}

export class CompanyAdminDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;

  @ApiProperty({ enum: CompanyAdminRole })
  role: CompanyAdminRole;
}

export class CompanyServiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Cloud migration consulting' })
  name: string;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class CompanySummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Acme Inc.' })
  name: string;

  @ApiPropertyOptional({ nullable: true })
  logoUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  industry: string | null;
}

export class CompanyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Acme Inc.' })
  name: string;

  @ApiPropertyOptional({ nullable: true })
  tagline: string | null;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiPropertyOptional({ nullable: true })
  industry: string | null;

  @ApiPropertyOptional({ enum: CompanySize, nullable: true })
  size: CompanySize | null;

  @ApiPropertyOptional({ nullable: true })
  foundedYear: number | null;

  @ApiPropertyOptional({ nullable: true })
  websiteUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  headquarters: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  coverUrl: string | null;

  @ApiProperty({ example: 12 })
  employeesCount: number;

  @ApiProperty({ example: 4 })
  currentEmployeesCount: number;

  @ApiProperty({ example: 3 })
  jobsCount: number;

  @ApiProperty({
    type: [CompanyEmployeeDto],
    description: 'Current employees first, then most recently departed.',
  })
  employees: CompanyEmployeeDto[];

  @ApiProperty({ type: [CompanyServiceResponseDto] })
  services: CompanyServiceResponseDto[];

  @ApiProperty({ type: [CompanyAdminDto] })
  admins: CompanyAdminDto[];

  @ApiProperty({
    description: 'Whether the current viewer can manage this company page',
  })
  isViewerAdmin: boolean;

  @ApiProperty({ example: 128 })
  followersCount: number;

  @ApiProperty({
    description: 'Whether the current viewer follows this company page',
  })
  isViewerFollowing: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
