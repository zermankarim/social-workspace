import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserPublic, userPublicSelect } from '../users/user.select';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }

  findMany(
    where: Prisma.UserWhereInput,
    orderBy: Prisma.UserOrderByWithRelationInput,
    skip: number,
    take: number,
  ): Promise<UserPublic[]> {
    return this.prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
      select: userPublicSelect,
    });
  }

  count(where: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }
}
