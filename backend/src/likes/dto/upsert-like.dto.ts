import { ApiProperty } from '@nestjs/swagger';
import { PostLikeType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpsertLikeDto {
  @ApiProperty({
    enum: PostLikeType,
    example: PostLikeType.LIKE,
    description: 'Reaction type to set on the post',
  })
  @IsEnum(PostLikeType)
  public likeType: PostLikeType;
}
