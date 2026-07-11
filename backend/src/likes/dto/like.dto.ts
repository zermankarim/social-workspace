import { ApiProperty } from '@nestjs/swagger';
import { PostLikeType } from '@prisma/client';
import { LikeAuthorDto } from './like-author.dto';

export class LikeResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public postId: string;

  @ApiProperty({ enum: PostLikeType, example: PostLikeType.LIKE })
  public likeType: PostLikeType;

  @ApiProperty({ example: '2026-07-11T12:00:00.000Z' })
  public createdAt: Date;

  @ApiProperty({ type: LikeAuthorDto })
  public author: LikeAuthorDto;
}
