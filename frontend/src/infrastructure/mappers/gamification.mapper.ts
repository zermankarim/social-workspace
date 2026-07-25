import {
  BadgeCatalog,
  BadgeCatalogItem,
} from "@/core/domain/entities/badge-catalog.entity";
import { GamificationState } from "@/core/domain/entities/gamification-state.entity";
import {
  Leaderboard,
  LeaderboardEntry,
} from "@/core/domain/entities/leaderboard.entity";
import { LevelProgress } from "@/core/domain/entities/level-progress.entity";
import type {
  BadgeCatalogResponseDto,
  GamificationStateResponseDto,
  LeaderboardResponseDto,
  LevelProgressResponseDto,
} from "@/infrastructure/api/dto/gamification-response.dto";

export class GamificationMapper {
  static levelFromApi(dto: LevelProgressResponseDto): LevelProgress {
    return new LevelProgress(
      dto.key,
      dto.minPoints,
      dto.nextLevelKey,
      dto.nextLevelPoints,
      dto.progressPercent,
    );
  }

  static stateFromApi(dto: GamificationStateResponseDto): GamificationState {
    return new GamificationState(
      dto.pointsBalance,
      dto.currentStreak,
      dto.longestStreak,
      dto.profileCompletionPercent,
      dto.badges,
      dto.newlyEarnedBadges,
      this.levelFromApi(dto.level),
      dto.pointsAwarded,
    );
  }

  static badgeCatalogFromApi(dto: BadgeCatalogResponseDto): BadgeCatalog {
    return new BadgeCatalog(
      dto.badges.map(
        (badge) =>
          new BadgeCatalogItem(
            badge.key,
            badge.category,
            badge.tier,
            badge.threshold,
            badge.bonusPoints,
            badge.earned,
            badge.earnedAt ? new Date(badge.earnedAt) : null,
            badge.progressCurrent,
          ),
      ),
      dto.totalEarned,
      dto.totalCount,
    );
  }

  static leaderboardFromApi(dto: LeaderboardResponseDto): Leaderboard {
    return new Leaderboard(
      dto.entries.map(
        (entry) =>
          new LeaderboardEntry(
            entry.rank,
            entry.userId,
            entry.firstName,
            entry.lastName,
            entry.avatarUrl,
            entry.headline,
            entry.points,
            entry.isCurrentUser,
          ),
      ),
      dto.currentUserRank,
      dto.scope,
      dto.period,
    );
  }
}
