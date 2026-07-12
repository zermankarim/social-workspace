import { ApiProperty } from '@nestjs/swagger';
import { LanguageProficiency } from '@prisma/client';

export class LanguageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'en' })
  code: string;

  @ApiProperty({ example: 'English' })
  nameEn: string;

  @ApiProperty({ example: 'Английский' })
  nameRu: string;
}

export class UserLanguageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: LanguageResponseDto })
  language: LanguageResponseDto;

  @ApiProperty({ enum: LanguageProficiency })
  proficiency: LanguageProficiency;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
