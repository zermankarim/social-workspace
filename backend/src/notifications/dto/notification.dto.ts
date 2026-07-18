import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import { PostAuthorDto } from '../../posts/dto/post-author.dto';

export class NotificationPostPreviewDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiPropertyOptional({ example: 'Great news to share!', nullable: true })
  textContent: string | null;
}

export class NotificationResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.POST_LIKE })
  type: NotificationType;

  @ApiProperty({ example: false })
  read: boolean;

  @ApiProperty({ example: '2026-07-16T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({
    type: PostAuthorDto,
    description: 'User who triggered the notification',
  })
  actor: PostAuthorDto;

  @ApiPropertyOptional({
    type: NotificationPostPreviewDto,
    nullable: true,
    description: 'Related post, when the notification targets a post',
  })
  post: NotificationPostPreviewDto | null;
}
