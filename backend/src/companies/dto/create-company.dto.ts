import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CompanySize } from '@prisma/client';

const CURRENT_YEAR = 2100; // generous upper bound; avoids a runtime `new Date()` call at module load

export class CreateCompanyDto {
  @ApiProperty({ example: 'Acme Inc.', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Building tools for growing teams' })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  tagline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ example: 'Software Development' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  industry?: string;

  @ApiPropertyOptional({ enum: CompanySize })
  @IsOptional()
  @IsEnum(CompanySize)
  size?: CompanySize;

  @ApiPropertyOptional({ example: 2015 })
  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(CURRENT_YEAR)
  foundedYear?: number;

  @ApiPropertyOptional({ example: 'https://acme.example.com' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  websiteUrl?: string;

  @ApiPropertyOptional({ example: 'Berlin, Germany' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  headquarters?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  coverUrl?: string;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({ maxLength: 220 })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  tagline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  industry?: string;

  @ApiPropertyOptional({ enum: CompanySize })
  @IsOptional()
  @IsEnum(CompanySize)
  size?: CompanySize;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(CURRENT_YEAR)
  foundedYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  headquarters?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  coverUrl?: string;
}
