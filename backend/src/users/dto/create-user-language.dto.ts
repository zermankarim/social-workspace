import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { LanguageProficiency } from '@prisma/client';

export class CreateUserLanguageDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  languageId: string;

  @ApiProperty({ enum: LanguageProficiency })
  @IsEnum(LanguageProficiency)
  proficiency: LanguageProficiency;
}

export class UpdateUserLanguageDto {
  @ApiPropertyOptional({ enum: LanguageProficiency })
  @IsOptional()
  @IsEnum(LanguageProficiency)
  proficiency?: LanguageProficiency;
}
