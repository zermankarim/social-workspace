import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  COMMENT_ATTACHMENTS_MAX_COUNT,
  COMMENT_TEXT_MAX_LENGTH,
} from '../constants/comment.constants';
import { CommentAttachmentInputDto } from './comment-attachment.dto';

@ValidatorConstraint({ name: 'commentHasContent', async: false })
class CommentHasContentConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const dto = args.object as CreateCommentDto;
    const text = dto.textContent;

    if (text !== undefined && text !== null) {
      if (typeof text !== 'string') {
        return false;
      }
      if (text.length > COMMENT_TEXT_MAX_LENGTH) {
        return false;
      }
    }

    const hasText = typeof text === 'string' && text.trim().length > 0;
    const hasAttachments =
      Array.isArray(dto.attachments) && dto.attachments.length > 0;
    return hasText || hasAttachments;
  }

  defaultMessage(args: ValidationArguments): string {
    const dto = args.object as CreateCommentDto;
    if (
      typeof dto.textContent === 'string' &&
      dto.textContent.length > COMMENT_TEXT_MAX_LENGTH
    ) {
      return `textContent must be at most ${COMMENT_TEXT_MAX_LENGTH} characters`;
    }
    return 'Comment must include non-empty textContent or at least one attachment';
  }
}

export class CreateCommentDto {
  @ApiPropertyOptional({
    example: 'Nice post!',
    description:
      'Optional comment text. Required if attachments are omitted or empty.',
    maxLength: COMMENT_TEXT_MAX_LENGTH,
  })
  // Property decorator only. Do not add @IsOptional here — it would skip
  // this constraint when textContent is omitted from the body.
  @Validate(CommentHasContentConstraint)
  public textContent?: string;

  @ApiPropertyOptional({
    type: [CommentAttachmentInputDto],
    description:
      'Optional attachments from POST /upload. Required if textContent is empty.',
    maxItems: COMMENT_ATTACHMENTS_MAX_COUNT,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(COMMENT_ATTACHMENTS_MAX_COUNT)
  @ValidateNested({ each: true })
  @Type(() => CommentAttachmentInputDto)
  public attachments?: CommentAttachmentInputDto[];
}
