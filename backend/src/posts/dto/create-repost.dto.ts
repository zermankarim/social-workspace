import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { POST_TEXT_MAX_LENGTH } from '../constants/post.constants';

export class CreateRepostDto {
  @ApiPropertyOptional({
    example: 'This is worth sharing 👇',
    description:
      'Optional quote added above the original post. Omit for a plain repost.',
    maxLength: POST_TEXT_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(POST_TEXT_MAX_LENGTH)
  public textContent?: string;
}
