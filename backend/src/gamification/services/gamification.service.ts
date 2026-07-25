import { Injectable } from '@nestjs/common';
import {
  GamificationRepository,
  ProfileCompletionFields,
} from '../repositories/gamification.repository';
import { GamificationStateResponseDto } from '../dto/gamification-state.dto';
import {
  BadgeCatalogItemDto,
  BadgeCatalogResponseDto,
} from '../dto/badge-catalog.dto';
import {
  LeaderboardEntryDto,
  LeaderboardPeriod,
  LeaderboardQueryDto,
  LeaderboardResponseDto,
  LeaderboardScope,
} from '../dto/leaderboard.dto';
import { BADGE_DEFINITIONS, BadgeStats } from '../constants/badges.constants';
import { getLevelProgress } from '../constants/levels.constants';
import { ConnectionsService } from '../../connections/services/connections.service';
import { FollowsService } from '../../follows/services/follows.service';
import { NotificationsService } from '../../notifications/services/notifications.service';

const DAY_MS = 24 * 60 * 60 * 1000;
const CHECK_IN_POINTS = 5;
const PROFILE_CRITERION_POINTS = 15;

type ProfileCriterion = {
  key: string;
  test: (fields: ProfileCompletionFields) => boolean;
};

const PROFILE_CRITERIA: ProfileCriterion[] = [
  { key: 'avatar', test: (f) => Boolean(f.avatarUrl) },
  { key: 'cover', test: (f) => Boolean(f.coverUrl) },
  { key: 'headline', test: (f) => Boolean(f.headline?.trim()) },
  { key: 'bio', test: (f) => Boolean(f.bio?.trim()) },
  { key: 'skills', test: (f) => f._count.skills >= 3 },
  { key: 'experience', test: (f) => f._count.experiences >= 1 },
  { key: 'education', test: (f) => f._count.educations >= 1 },
  {
    key: 'social',
    test: (f) => Boolean(f.website || f.github || f.linkedin || f.twitter),
  },
  { key: 'resume', test: (f) => f._count.resumes >= 1 },
];

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function periodSince(period: LeaderboardPeriod): Date | null {
  const now = Date.now();
  if (period === LeaderboardPeriod.WEEK) return new Date(now - 7 * DAY_MS);
  if (period === LeaderboardPeriod.MONTH) return new Date(now - 30 * DAY_MS);
  return null;
}

@Injectable()
export class GamificationService {
  constructor(
    private readonly gamificationRepository: GamificationRepository,
    private readonly connectionsService: ConnectionsService,
    private readonly followsService: FollowsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Idempotent per calendar day — safe to call on every app load and every
   * time the gamification widget mounts. Advances the daily streak at most
   * once per day and awards points for any profile-completion criteria that
   * newly became true since the last call.
   */
  public async checkIn(userId: string): Promise<GamificationStateResponseDto> {
    const record = await this.gamificationRepository.findOrCreate(userId);
    const today = startOfDay(new Date());
    const lastActive = record.lastActiveDate
      ? startOfDay(record.lastActiveDate)
      : null;

    let currentStreak = record.currentStreak;
    let checkedInToday = false;

    if (!lastActive || lastActive.getTime() !== today.getTime()) {
      const isConsecutiveDay =
        lastActive !== null &&
        today.getTime() - lastActive.getTime() === DAY_MS;
      currentStreak = isConsecutiveDay ? currentStreak + 1 : 1;
      checkedInToday = true;
    }
    const longestStreak = Math.max(record.longestStreak, currentStreak);

    const profileFields =
      await this.gamificationRepository.getProfileCompletionFields(userId);
    const newlyCompleted = profileFields
      ? PROFILE_CRITERIA.filter(
          (criterion) =>
            criterion.test(profileFields) &&
            !record.awardedCriteria.includes(criterion.key),
        )
      : [];

    const pointsAwarded =
      (checkedInToday ? CHECK_IN_POINTS : 0) +
      newlyCompleted.length * PROFILE_CRITERION_POINTS;

    await this.gamificationRepository.update(userId, {
      currentStreak,
      longestStreak,
      lastActiveDate: today,
      awardedCriteria: [
        ...record.awardedCriteria,
        ...newlyCompleted.map((criterion) => criterion.key),
      ],
      pointsBalance: { increment: pointsAwarded },
    });

    if (checkedInToday) {
      await this.gamificationRepository.createTransaction(
        userId,
        CHECK_IN_POINTS,
        'daily-check-in',
      );
    }
    for (const criterion of newlyCompleted) {
      await this.gamificationRepository.createTransaction(
        userId,
        PROFILE_CRITERION_POINTS,
        `profile-completion:${criterion.key}`,
      );
    }

    const completedCount = profileFields
      ? PROFILE_CRITERIA.filter((criterion) => criterion.test(profileFields))
          .length
      : 0;
    const profileCompletionPercent = Math.round(
      (completedCount / PROFILE_CRITERIA.length) * 100,
    );

    const newlyEarnedBadges = await this.evaluateAndAwardBadges(userId);
    const [earnedKeys, updated] = await Promise.all([
      this.gamificationRepository.listEarnedBadgeKeys(userId),
      this.gamificationRepository.findOrCreate(userId),
    ]);

    return {
      pointsBalance: updated.pointsBalance,
      currentStreak: updated.currentStreak,
      longestStreak: updated.longestStreak,
      profileCompletionPercent,
      badges: earnedKeys,
      newlyEarnedBadges: newlyEarnedBadges.map((badge) => badge.key),
      level: getLevelProgress(updated.pointsBalance),
      pointsAwarded,
    };
  }

  /** Generic award hook used by GamificationListener for activity-based points (post published, like/comment/endorsement received, connection accepted). */
  public async awardPoints(
    userId: string,
    amount: number,
    reason: string,
  ): Promise<void> {
    await this.gamificationRepository.findOrCreate(userId);
    await this.gamificationRepository.update(userId, {
      pointsBalance: { increment: amount },
    });
    await this.gamificationRepository.createTransaction(userId, amount, reason);
    await this.evaluateAndAwardBadges(userId);
  }

  public async getBadgeCatalog(
    userId: string,
  ): Promise<BadgeCatalogResponseDto> {
    const [stats, earnedBadges] = await Promise.all([
      this.computeBadgeStats(userId),
      this.gamificationRepository.listEarnedBadges(userId),
    ]);
    const earnedByKey = new Map(
      earnedBadges.map((badge) => [badge.badgeKey, badge.earnedAt]),
    );

    const badges: BadgeCatalogItemDto[] = BADGE_DEFINITIONS.map((badge) => ({
      key: badge.key,
      category: badge.category,
      tier: badge.tier,
      threshold: badge.threshold,
      bonusPoints: badge.bonusPoints,
      earned: earnedByKey.has(badge.key),
      earnedAt: earnedByKey.get(badge.key) ?? null,
      progressCurrent: stats[badge.statKey],
    }));

    return {
      badges,
      totalEarned: earnedByKey.size,
      totalCount: BADGE_DEFINITIONS.length,
    };
  }

  public async getLeaderboard(
    userId: string,
    query: LeaderboardQueryDto,
  ): Promise<LeaderboardResponseDto> {
    const scope = query.scope ?? LeaderboardScope.NETWORK;
    const period = query.period ?? LeaderboardPeriod.WEEK;
    const since = periodSince(period);

    let scopedUserIds: string[] | null = null;
    if (scope === LeaderboardScope.NETWORK) {
      const [peerIds, followCounts, followingIds] = await Promise.all([
        this.connectionsService.findAcceptedPeerUserIds(userId),
        this.followsService.getCounts(userId),
        this.followsService.findFollowingIds(userId),
      ]);
      void followCounts;
      scopedUserIds = Array.from(
        new Set([userId, ...peerIds, ...followingIds]),
      );
    }

    const totals = await this.gamificationRepository.getLeaderboardTotals(
      scopedUserIds,
      since,
      50,
    );

    const users = await this.gamificationRepository.getUsersBasicInfo(
      totals.map((row) => row.userId),
    );
    const userById = new Map(users.map((user) => [user.id, user]));

    const entries: LeaderboardEntryDto[] = totals
      .map((row, index) => {
        const user = userById.get(row.userId);
        if (!user) return null;
        return {
          rank: index + 1,
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          headline: user.headline,
          points: row.total,
          isCurrentUser: user.id === userId,
        };
      })
      .filter((entry): entry is LeaderboardEntryDto => entry !== null);

    const currentUserRank =
      entries.find((entry) => entry.isCurrentUser)?.rank ?? null;

    return { entries, currentUserRank, scope, period };
  }

  private async computeBadgeStats(userId: string): Promise<BadgeStats> {
    const [
      gamification,
      connectionsCount,
      followCounts,
      activityStats,
      profileFields,
    ] = await Promise.all([
      this.gamificationRepository.findOrCreate(userId),
      this.connectionsService.countAcceptedByUserId(userId),
      this.followsService.getCounts(userId),
      this.gamificationRepository.getActivityStats(userId),
      this.gamificationRepository.getProfileCompletionFields(userId),
    ]);

    const completedCount = profileFields
      ? PROFILE_CRITERIA.filter((criterion) => criterion.test(profileFields))
          .length
      : 0;
    const profileCompletionPercent = Math.round(
      (completedCount / PROFILE_CRITERIA.length) * 100,
    );

    return {
      longestStreak: gamification.longestStreak,
      connectionsCount,
      followersCount: followCounts.followersCount,
      postsCount: activityStats.postsCount,
      likesReceivedCount: activityStats.likesReceivedCount,
      commentsReceivedCount: activityStats.commentsReceivedCount,
      endorsementsReceivedCount: activityStats.endorsementsReceivedCount,
      pointsBalance: gamification.pointsBalance,
      profileCompletionPercent,
      applicationsSentCount: activityStats.applicationsSentCount,
      applicationsAcceptedCount: activityStats.applicationsAcceptedCount,
      totalExperienceMonths: activityStats.totalExperienceMonths,
    };
  }

  /** Persists any newly-eligible badges, applies their bonus points once, and notifies. Returns only the newly earned ones. */
  private async evaluateAndAwardBadges(
    userId: string,
  ): Promise<Array<{ key: string }>> {
    const [stats, earnedKeys] = await Promise.all([
      this.computeBadgeStats(userId),
      this.gamificationRepository.listEarnedBadgeKeys(userId),
    ]);
    const earned = new Set(earnedKeys);

    const newlyEarned = BADGE_DEFINITIONS.filter(
      (badge) =>
        !earned.has(badge.key) && stats[badge.statKey] >= badge.threshold,
    );
    if (newlyEarned.length === 0) return [];

    await this.gamificationRepository.createUserBadges(
      userId,
      newlyEarned.map((badge) => badge.key),
    );

    const bonusPoints = newlyEarned.reduce(
      (sum, badge) => sum + badge.bonusPoints,
      0,
    );
    if (bonusPoints > 0) {
      await this.gamificationRepository.update(userId, {
        pointsBalance: { increment: bonusPoints },
      });
      await this.gamificationRepository.createTransaction(
        userId,
        bonusPoints,
        'badge-bonus',
      );
    }

    await this.notificationsService.notifyBadgeEarned(userId);

    return newlyEarned.map((badge) => ({ key: badge.key }));
  }
}
