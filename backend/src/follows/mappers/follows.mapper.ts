import { FollowResponseDto } from '../dto/follow.dto';
import { FollowUserDto } from '../dto/follow-user.dto';
import { FollowSelected, FollowUserSelected } from '../follows.select';

export class FollowsMapper {
  static toUserDto(user: FollowUserSelected): FollowUserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }

  static toResponseDto(follow: FollowSelected): FollowResponseDto {
    return {
      id: follow.id,
      follower: this.toUserDto(follow.follower),
      following: this.toUserDto(follow.following),
      createdAt: follow.createdAt,
    };
  }
}
