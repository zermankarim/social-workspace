import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  POST_ATTACHMENTS_MAX_COUNT,
  POST_TEXT_MAX_LENGTH,
} from '../constants/post.constants';
import { PostAttachmentInputDto } from './post-attachment.dto';

export class UpdatePostDto {
  @ApiPropertyOptional({
    example: 'Updated post text',
    description: 'New post text. Omit to leave unchanged.',
    maxLength: POST_TEXT_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(POST_TEXT_MAX_LENGTH)
  public textContent?: string;

  @ApiPropertyOptional({
    type: [PostAttachmentInputDto],
    description:
      'Full replacement list of attachments when provided. Omit to leave attachments unchanged.',
    maxItems: POST_ATTACHMENTS_MAX_COUNT,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(POST_ATTACHMENTS_MAX_COUNT)
  @ValidateNested({ each: true })
  @Type(() => PostAttachmentInputDto)
  public attachments?: PostAttachmentInputDto[];
}
