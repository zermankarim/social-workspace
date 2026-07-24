import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Backend Engineer', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({ example: 'Acme Inc.', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  companyName: string;

  @ApiPropertyOptional({ example: 'Remote', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @ApiProperty({ example: 'We are looking for...', maxLength: 5000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ example: 'https://example.com/careers/123' })
  @IsUrl({ require_tld: false })
  applyUrl: string;
}
