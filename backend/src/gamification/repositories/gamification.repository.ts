import { Injectable } from '@nestjs/common';
import { Prisma, UserGamification } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export type ProfileCompletionFields = {
  avatarUrl: string | null;
  coverUrl: string | null;
  headline: string | null;
  bio: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  _count: { skills: number; experiences: number; educations: number };
};

@Injectable()
export class GamificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOrCreate(userId: string): Promise<UserGamification> {
    return this.prisma.userGamification.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  update(
    userId: string,
    data: Prisma.UserGamificationUpdateInput,
  ): Promise<UserGamification> {
    return this.prisma.userGamification.update({
      where: { userId },
      data,
    });
  }

  createTransaction(
    userId: string,
    amount: number,
    reason: string,
  ): Promise<void> {
    return this.prisma.pointsTransaction
      .create({ data: { userId, amount, reason } })
      .then(() => undefined);
  }

  getProfileCompletionFields(
    userId: string,
  ): Promise<ProfileCompletionFields | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        avatarUrl: true,
        coverUrl: true,
        headline: true,
        bio: true,
        website: true,
        github: true,
        linkedin: true,
        twitter: true,
        _count: {
          select: { skills: true, experiences: true, educations: true },
        },
      },
    });
  }
}
