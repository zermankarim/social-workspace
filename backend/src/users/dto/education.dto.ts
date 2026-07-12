import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EducationDegree } from '@prisma/client';
import { SkillResponseDto } from './skill.dto';

export class EducationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ example: 'MIT' })
  schoolName: string;

  @ApiProperty({ enum: EducationDegree })
  degree: EducationDegree;

  @ApiProperty({ example: '2018-09-01' })
  startDate: Date;

  @ApiPropertyOptional({ nullable: true, example: '2022-06-01' })
  endDate: Date | null;

  @ApiPropertyOptional({ nullable: true })
  description: string | null;

  @ApiPropertyOptional({ nullable: true, example: 3.8 })
  gradePoint: number | null;

  @ApiProperty({ type: [SkillResponseDto] })
  skills: SkillResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
