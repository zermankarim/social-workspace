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
  COMMENT_ATTACHMENTS_MAX_COUNT,
  COMMENT_TEXT_MAX_LENGTH,
} from '../constants/comment.constants';
import { CommentAttachmentInputDto } from './comment-attachment.dto';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'Updated comment text',
    description: 'New comment text. Omit to leave unchanged.',
    maxLength: COMMENT_TEXT_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(COMMENT_TEXT_MAX_LENGTH)
  public textContent?: string;

  @ApiPropertyOptional({
    type: [CommentAttachmentInputDto],
    description:
      'Full replacement list of attachments when provided. Omit to leave attachments unchanged.',
    maxItems: COMMENT_ATTACHMENTS_MAX_COUNT,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(COMMENT_ATTACHMENTS_MAX_COUNT)
  @ValidateNested({ each: true })
  @Type(() => CommentAttachmentInputDto)
  public attachments?: CommentAttachmentInputDto[];
}
