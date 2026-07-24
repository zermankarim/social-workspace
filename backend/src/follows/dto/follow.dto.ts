import { ApiProperty } from '@nestjs/swagger';
import { FollowUserDto } from './follow-user.dto';

export class FollowResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ type: FollowUserDto })
  follower: FollowUserDto;

  @ApiProperty({ type: FollowUserDto })
  following: FollowUserDto;

  @ApiProperty({ example: '2026-07-25T12:00:00.000Z' })
  createdAt: Date;
}

export class FollowCountsResponseDto {
  @ApiProperty({ example: 128 })
  followersCount: number;

  @ApiProperty({ example: 64 })
  followingCount: number;
}

export class FollowStatusResponseDto {
  @ApiProperty({ example: true })
  isFollowing: boolean;
}
