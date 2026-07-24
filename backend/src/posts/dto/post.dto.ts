import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';
import { PostAttachmentResponseDto } from './post-attachment.dto';
import { PostAuthorDto } from './post-author.dto';
import { CommentResponseDto } from '../../comments/dto/comment.dto';
import { LikeResponseDto } from '../../likes/dto/like.dto';

export class PostResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public id: string;

  @ApiPropertyOptional({
    example: 'This is a post',
    nullable: true,
    description: 'Post text. Null when the post is attachments-only.',
  })
  public textContent: string | null;

  @ApiProperty({ enum: PostStatus, example: PostStatus.PUBLISHED })
  public status: PostStatus;

  @ApiPropertyOptional({
    nullable: true,
    description: 'When a SCHEDULED post will auto-publish.',
  })
  public scheduledFor: Date | null;

  @ApiProperty({ example: '2026-07-11T12:00:00.000Z' })
  public createdAt: Date;

  @ApiProperty({ example: '2026-07-11T12:00:00.000Z' })
  public updatedAt: Date;

  @ApiProperty({ type: PostAuthorDto })
  public author: PostAuthorDto;

  @ApiProperty({ example: 10, description: 'Denormalized comments counter' })
  public commentsCount: number;

  @ApiProperty({ example: 10, description: 'Denormalized likes counter' })
  public likesCount: number;

  @ApiProperty({ example: 2, description: 'Denormalized reposts counter' })
  public repostsCount: number;

  @ApiProperty({
    example: 128,
    description: 'Denormalized impressions counter',
  })
  public impressionsCount: number;

  @ApiPropertyOptional({
    type: () => PostResponseDto,
    nullable: true,
    description:
      'Original post when this entry is a repost (with an optional quote in textContent).',
  })
  public repostOf: PostResponseDto | null;

  @ApiProperty({ type: [PostAttachmentResponseDto] })
  public attachments: PostAttachmentResponseDto[];

  @ApiProperty({
    type: [CommentResponseDto],
    description: 'Newest comments preview (up to 2)',
  })
  public previewComments: CommentResponseDto[];

  @ApiProperty({
    type: [LikeResponseDto],
    description: 'Newest likes/reactions preview (up to 2)',
  })
  public previewLikes: LikeResponseDto[];
}
