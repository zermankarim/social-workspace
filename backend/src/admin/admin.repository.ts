import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { userPublicSelect } from '../users/user.select';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllUsers() {
    return this.prisma.user.findMany({
      select: userPublicSelect,
    });
  }

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }
}
