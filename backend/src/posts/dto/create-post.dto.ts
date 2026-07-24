import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsISO8601,
  IsOptional,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  POST_ATTACHMENTS_MAX_COUNT,
  POST_TEXT_MAX_LENGTH,
} from '../constants/post.constants';
import { PostAttachmentInputDto } from './post-attachment.dto';

@ValidatorConstraint({ name: 'postHasContent', async: false })
class PostHasContentConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const dto = args.object as CreatePostDto;
    const text = dto.textContent;

    if (text !== undefined && text !== null) {
      if (typeof text !== 'string') {
        return false;
      }
      if (text.length > POST_TEXT_MAX_LENGTH) {
        return false;
      }
    }

    const hasText = typeof text === 'string' && text.trim().length > 0;
    const hasAttachments =
      Array.isArray(dto.attachments) && dto.attachments.length > 0;
    return hasText || hasAttachments;
  }

  defaultMessage(args: ValidationArguments): string {
    const dto = args.object as CreatePostDto;
    if (
      typeof dto.textContent === 'string' &&
      dto.textContent.length > POST_TEXT_MAX_LENGTH
    ) {
      return `textContent must be at most ${POST_TEXT_MAX_LENGTH} characters`;
    }
    return 'Post must include non-empty textContent or at least one attachment';
  }
}

export class CreatePostDto {
  @ApiPropertyOptional({
    example: 'This is a post',
    description:
      'Optional post text. Required if attachments are omitted or empty.',
    maxLength: POST_TEXT_MAX_LENGTH,
  })
  // Property decorator only. Do not add @IsOptional here — it would skip
  // this constraint when textContent is omitted from the body.
  @Validate(PostHasContentConstraint)
  public textContent?: string;

  @ApiPropertyOptional({
    type: [PostAttachmentInputDto],
    description:
      'Optional attachments from POST /upload. Required if textContent is empty.',
    maxItems: POST_ATTACHMENTS_MAX_COUNT,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(POST_ATTACHMENTS_MAX_COUNT)
  @ValidateNested({ each: true })
  @Type(() => PostAttachmentInputDto)
  public attachments?: PostAttachmentInputDto[];

  @ApiPropertyOptional({
    enum: PostStatus,
    default: PostStatus.PUBLISHED,
    description:
      'PUBLISHED (default) is visible immediately. DRAFT is visible only to the author. ' +
      'SCHEDULED auto-publishes at `scheduledFor`.',
  })
  @IsOptional()
  @IsEnum(PostStatus)
  public status?: PostStatus;

  @ApiPropertyOptional({
    example: '2026-08-01T12:00:00.000Z',
    description: 'Required future date-time when status is SCHEDULED.',
  })
  @IsOptional()
  @IsISO8601()
  public scheduledFor?: string;
}
