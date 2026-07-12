import { PreferredLocale } from "@/core/domain/enums/preferred-locale.enum";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import { User } from "@/core/domain/entities/user.entity";
import type { UserProfile } from "@/core/domain/entities/user-profile.entity";
import type { UserResponseDto } from "@/infrastructure/api/dto/auth-response.dto";
import { LocationMapper } from "@/infrastructure/mappers/location.mapper";

function parseLocale(value: string | undefined): PreferredLocale {
  return value === PreferredLocale.RU ? PreferredLocale.RU : PreferredLocale.EN;
}

export class UserMapper {
  static fromApi(dto: UserResponseDto): User {
    return new User(
      dto.id,
      dto.email,
      dto.role as ProfileRole,
      dto.firstName,
      dto.lastName,
      dto.headline ?? null,
      dto.bio,
      dto.location ? LocationMapper.fromApi(dto.location) : null,
      dto.avatarUrl,
      dto.coverUrl ?? null,
      parseLocale(dto.preferredLocale),
      dto.github,
      dto.linkedin,
      dto.website,
      dto.twitter,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  static fromProfile(profile: UserProfile): User | null {
    if (!profile.email) return null;

    return new User(
      profile.id,
      profile.email,
      profile.role,
      profile.firstName,
      profile.lastName,
      profile.headline,
      profile.bio,
      profile.location,
      profile.avatarUrl,
      profile.coverUrl,
      profile.preferredLocale,
      profile.github,
      profile.linkedin,
      profile.website,
      profile.twitter,
      profile.createdAt,
      profile.updatedAt,
    );
  }
}
