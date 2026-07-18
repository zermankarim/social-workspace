import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNewsStoryDto {
  @ApiProperty({ example: 'Remote teams rethink office days' })
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  public title: string;

  @ApiPropertyOptional({ example: 'A short summary line.' })
  @IsOptional()
  @IsString()
  @MaxLength(280)
  public summary?: string;

  @ApiPropertyOptional({
    example: 'The full editorial story, written as plain text.',
  })
  @IsOptional()
  @IsString()
  @MinLength(40)
  @MaxLength(20_000)
  public body?: string;

  @ApiPropertyOptional({ example: 'https://example.com/story' })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(2048)
  public url?: string;
}
