import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentAuthorDto } from './comment-author.dto';
import { CommentAttachmentResponseDto } from './comment-attachment.dto';

export class CommentResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public id: string;

  @ApiPropertyOptional({
    example: 'Nice post!',
    nullable: true,
  })
  public textContent: string | null;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public postId: string;

  @ApiProperty({ example: '2026-07-11T12:00:00.000Z' })
  public createdAt: Date;

  @ApiProperty({ example: '2026-07-11T12:00:00.000Z' })
  public updatedAt: Date;

  @ApiProperty({ type: CommentAuthorDto })
  public author: CommentAuthorDto;

  @ApiProperty({ type: [CommentAttachmentResponseDto] })
  public attachments: CommentAttachmentResponseDto[];
}
