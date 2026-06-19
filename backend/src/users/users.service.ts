import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user };
  }

  async getUsers(): Promise<Array<UserResponseDto>> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
