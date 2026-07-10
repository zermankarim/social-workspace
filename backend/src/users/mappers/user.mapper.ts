import { UserResponseDto } from '../dto/user.dto';
import { UserPublic } from '../user.select';
import { LocationMapper } from './location.mapper';

export class UserMapper {
  static fromPrismaToResponse(user: UserPublic): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      location: user.location
        ? LocationMapper.fromPrismaToResponse(user.location)
        : null,
      avatarUrl: user.avatarUrl,
      github: user.github,
      linkedin: user.linkedin,
      website: user.website,
      twitter: user.twitter,
    };
  }
}
