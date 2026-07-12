import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmploymentType, WorkplaceType } from '@prisma/client';

export class WorkExperienceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ example: 'Software Engineer' })
  title: string;

  @ApiProperty({ enum: EmploymentType })
  employmentType: EmploymentType;

  @ApiProperty({ example: 'Acme Inc.' })
  companyName: string;

  @ApiProperty({ example: '2022-01-01' })
  startDate: Date;

  @ApiPropertyOptional({ nullable: true, example: '2024-06-01' })
  endDate: Date | null;

  @ApiProperty({ enum: WorkplaceType })
  workplaceType: WorkplaceType;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
