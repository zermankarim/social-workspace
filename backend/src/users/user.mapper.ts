import { UserResponseDto } from './dto/user.dto';
import { UserPublic } from './user.select';

export class UserMapper {
  static fromPrismaToResponse(user: UserPublic): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
