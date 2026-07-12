import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PreferredLocale } from '@prisma/client';
import { HEADLINE_MAX_LENGTH } from '../constants/profile.constants';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    example: 'Software Engineer | Open Source',
    maxLength: HEADLINE_MAX_LENGTH,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(HEADLINE_MAX_LENGTH)
  headline?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(2000)
  bio?: string | null;

  @ApiPropertyOptional({
    example: 'http://localhost:8000/files/avatar.png',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_tld: false })
  avatarUrl?: string | null;

  @ApiPropertyOptional({
    example: 'http://localhost:8000/files/cover.png',
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_tld: false })
  coverUrl?: string | null;

  @ApiPropertyOptional({ enum: PreferredLocale, example: PreferredLocale.en })
  @IsOptional()
  @IsEnum(PreferredLocale)
  preferredLocale?: PreferredLocale;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_tld: false })
  website?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_tld: false })
  github?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_tld: false })
  linkedin?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsUrl({ require_tld: false })
  twitter?: string | null;
}
