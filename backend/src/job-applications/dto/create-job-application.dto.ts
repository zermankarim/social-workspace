import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateJobApplicationDto {
  @ApiPropertyOptional({
    description: 'One of your saved resumes (see GET /resumes/me).',
  })
  @IsOptional()
  @IsUUID()
  resumeId?: string;

  @ApiPropertyOptional({ maxLength: 254 })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ maxLength: 32 })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  contactPhone?: string;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverNote?: string;
}
