import { Injectable } from '@nestjs/common';
import {
  GamificationRepository,
  ProfileCompletionFields,
} from '../repositories/gamification.repository';
import { GamificationStateResponseDto } from '../dto/gamification-state.dto';
import { ConnectionsService } from '../../connections/services/connections.service';
import { FollowsService } from '../../follows/services/follows.service';

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
];

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

@Injectable()
export class GamificationService {
  constructor(
    private readonly gamificationRepository: GamificationRepository,
    private readonly connectionsService: ConnectionsService,
    private readonly followsService: FollowsService,
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

    const updated = await this.gamificationRepository.update(userId, {
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

    const badges = await this.computeBadges(userId, longestStreak);

    return {
      pointsBalance: updated.pointsBalance,
      currentStreak: updated.currentStreak,
      longestStreak: updated.longestStreak,
      profileCompletionPercent,
      badges,
      pointsAwarded,
    };
  }

  private async computeBadges(
    userId: string,
    longestStreak: number,
  ): Promise<string[]> {
    const [connectionsCount, followCounts] = await Promise.all([
      this.connectionsService.countAcceptedByUserId(userId),
      this.followsService.getCounts(userId),
    ]);

    const badges: string[] = [];
    if (longestStreak >= 7) badges.push('streak_7');
    if (longestStreak >= 30) badges.push('streak_30');
    if (connectionsCount >= 50) badges.push('connections_50');
    if (connectionsCount >= 100) badges.push('connections_100');
    if (followCounts.followersCount >= 100) badges.push('followers_100');
    return badges;
  }
}
