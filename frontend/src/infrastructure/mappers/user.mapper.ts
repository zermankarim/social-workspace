import { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import { User } from "@/core/domain/entities/user.entity";
import type { UserResponseDto } from "@/infrastructure/api/dto/auth-response.dto";

export class UserMapper {
  static fromApi(dto: UserResponseDto): User {
    return new User(
      dto.id,
      dto.email,
      dto.role as ProfileRole,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }
}
