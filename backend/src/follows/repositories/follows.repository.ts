import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { followSelect, FollowSelected } from '../follows.select';

@Injectable()
export class FollowsRepository {
  constructor(private readonly prisma: PrismaService) {}

  userExists(userId: string): Promise<boolean> {
    return this.prisma.user
      .findUnique({ where: { id: userId }, select: { id: true } })
      .then((user) => user !== null);
  }

  findByPair(
    followerId: string,
    followingId: string,
  ): Promise<FollowSelected | null> {
    return this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
      select: followSelect,
    });
  }

  create(followerId: string, followingId: string): Promise<FollowSelected> {
    return this.prisma.follow.create({
      data: { followerId, followingId },
      select: followSelect,
    });
  }

  async deleteByPair(
    followerId: string,
    followingId: string,
  ): Promise<boolean> {
    const result = await this.prisma.follow.deleteMany({
      where: { followerId, followingId },
    });
    return result.count > 0;
  }

  findFollowers(
    userId: string,
    skip: number,
    take: number,
  ): Promise<FollowSelected[]> {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      select: followSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countFollowers(userId: string): Promise<number> {
    return this.prisma.follow.count({ where: { followingId: userId } });
  }

  findFollowing(
    userId: string,
    skip: number,
    take: number,
  ): Promise<FollowSelected[]> {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      select: followSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countFollowing(userId: string): Promise<number> {
    return this.prisma.follow.count({ where: { followerId: userId } });
  }
}
