import { Injectable } from '@nestjs/common';
import {
  JobApplicationStatus,
  Prisma,
  PostStatus,
  UserGamification,
} from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

const MS_PER_MONTH = (1000 * 60 * 60 * 24 * 365.25) / 12;

/** Sums each stint's duration (endDate defaults to now for a current role); overlapping stints double-count on purpose — more roles worked in parallel is still more experience. */
function sumExperienceMonths(
  experiences: { startDate: Date; endDate: Date | null }[],
): number {
  const now = Date.now();
  const totalMs = experiences.reduce((sum, experience) => {
    const end = experience.endDate?.getTime() ?? now;
    return sum + Math.max(0, end - experience.startDate.getTime());
  }, 0);
  return Math.floor(totalMs / MS_PER_MONTH);
}

export type ProfileCompletionFields = {
  avatarUrl: string | null;
  coverUrl: string | null;
  headline: string | null;
  bio: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  _count: {
    skills: number;
    experiences: number;
    educations: number;
    resumes: number;
  };
};

export type ActivityStats = {
  postsCount: number;
  likesReceivedCount: number;
  commentsReceivedCount: number;
  endorsementsReceivedCount: number;
  applicationsSentCount: number;
  applicationsAcceptedCount: number;
  totalExperienceMonths: number;
};

export type LeaderboardUser = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
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
          select: {
            skills: true,
            experiences: true,
            educations: true,
            resumes: true,
          },
        },
      },
    });
  }

  async getActivityStats(userId: string): Promise<ActivityStats> {
    const [
      postsCount,
      likesReceivedCount,
      commentsReceivedCount,
      endorsementsReceivedCount,
      applicationsSentCount,
      applicationsAcceptedCount,
      experiences,
    ] = await Promise.all([
      this.prisma.post.count({
        where: { authorId: userId, status: PostStatus.PUBLISHED },
      }),
      this.prisma.postLike.count({ where: { post: { authorId: userId } } }),
      this.prisma.postComment.count({ where: { post: { authorId: userId } } }),
      this.prisma.skillEndorsement.count({ where: { userId } }),
      this.prisma.jobApplication.count({ where: { applicantId: userId } }),
      this.prisma.jobApplication.count({
        where: { applicantId: userId, status: JobApplicationStatus.ACCEPTED },
      }),
      this.prisma.workExperience.findMany({
        where: { userId },
        select: { startDate: true, endDate: true },
      }),
    ]);

    return {
      postsCount,
      likesReceivedCount,
      commentsReceivedCount,
      endorsementsReceivedCount,
      applicationsSentCount,
      applicationsAcceptedCount,
      totalExperienceMonths: sumExperienceMonths(experiences),
    };
  }

  async createUserBadges(userId: string, badgeKeys: string[]): Promise<void> {
    if (badgeKeys.length === 0) return;
    await this.prisma.userBadge.createMany({
      data: badgeKeys.map((badgeKey) => ({ userId, badgeKey })),
      skipDuplicates: true,
    });
  }

  async listEarnedBadgeKeys(userId: string): Promise<string[]> {
    const rows = await this.prisma.userBadge.findMany({
      where: { userId },
      select: { badgeKey: true },
    });
    return rows.map((row) => row.badgeKey);
  }

  listEarnedBadges(
    userId: string,
  ): Promise<{ badgeKey: string; earnedAt: Date }[]> {
    return this.prisma.userBadge.findMany({
      where: { userId },
      select: { badgeKey: true, earnedAt: true },
      orderBy: { earnedAt: 'desc' },
    });
  }

  async getLeaderboardTotals(
    userIds: string[] | null,
    since: Date | null,
    limit: number,
  ): Promise<{ userId: string; total: number }[]> {
    const rows = await this.prisma.pointsTransaction.groupBy({
      by: ['userId'],
      where: {
        ...(userIds ? { userId: { in: userIds } } : {}),
        ...(since ? { createdAt: { gte: since } } : {}),
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: limit,
    });
    return rows.map((row) => ({
      userId: row.userId,
      total: row._sum.amount ?? 0,
    }));
  }

  getUsersBasicInfo(userIds: string[]): Promise<LeaderboardUser[]> {
    return this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        headline: true,
      },
    });
  }
}
