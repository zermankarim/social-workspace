import { User } from '@prisma/client';
import { UserResponseDto } from './dto/user.dto';

export class UserMapper {
  static fromPrismaToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
