import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { EducationDegree } from '@prisma/client';
import {
  PROFILE_DESCRIPTION_MAX_LENGTH,
  SCHOOL_NAME_MAX_LENGTH,
  SKILL_NAME_MAX_LENGTH,
  SKILLS_MAX_COUNT,
} from '../constants/profile.constants';

export class CreateEducationDto {
  @ApiProperty({ example: 'MIT' })
  @IsString()
  @MaxLength(SCHOOL_NAME_MAX_LENGTH)
  schoolName: string;

  @ApiProperty({ enum: EducationDegree })
  @IsEnum(EducationDegree)
  degree: EducationDegree;

  @ApiProperty({ example: '2018-09-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    example: '2022-06-01',
    nullable: true,
    description: 'Omit or null if currently studying',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(PROFILE_DESCRIPTION_MAX_LENGTH)
  description?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 3.8 })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber()
  @Min(0)
  @Max(5)
  gradePoint?: number | null;

  @ApiPropertyOptional({
    type: [String],
    example: ['TypeScript', 'Algorithms'],
    maxItems: SKILLS_MAX_COUNT,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SKILLS_MAX_COUNT)
  @IsString({ each: true })
  @MaxLength(SKILL_NAME_MAX_LENGTH, { each: true })
  skillNames?: string[];
}

export class UpdateEducationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(SCHOOL_NAME_MAX_LENGTH)
  schoolName?: string;

  @ApiPropertyOptional({ enum: EducationDegree })
  @IsOptional()
  @IsEnum(EducationDegree)
  degree?: EducationDegree;

  @ApiPropertyOptional({ example: '2018-09-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsDateString()
  endDate?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(PROFILE_DESCRIPTION_MAX_LENGTH)
  description?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber()
  @Min(0)
  @Max(5)
  gradePoint?: number | null;

  @ApiPropertyOptional({
    type: [String],
    description: 'Full replacement list of skill names when provided',
    maxItems: SKILLS_MAX_COUNT,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SKILLS_MAX_COUNT)
  @IsString({ each: true })
  @MaxLength(SKILL_NAME_MAX_LENGTH, { each: true })
  skillNames?: string[];
}
