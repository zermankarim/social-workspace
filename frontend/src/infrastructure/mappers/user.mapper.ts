import { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import { User } from "@/core/domain/entities/user.entity";
import type { UserResponseDto } from "@/infrastructure/api/dto/auth-response.dto";
import { LocationMapper } from "@/infrastructure/mappers/location.mapper";

export class UserMapper {
  static fromApi(dto: UserResponseDto): User {
    return new User(
      dto.id,
      dto.email,
      dto.role as ProfileRole,
      dto.firstName,
      dto.lastName,
      dto.bio,
      dto.location ? LocationMapper.fromApi(dto.location) : null,
      dto.avatarUrl,
      dto.github,
      dto.linkedin,
      dto.website,
      dto.twitter,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }
}
