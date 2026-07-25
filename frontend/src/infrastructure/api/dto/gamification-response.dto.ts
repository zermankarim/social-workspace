import type {
  BadgeCategory,
  BadgeTier,
} from "@/core/domain/entities/badge-catalog.entity";
import type {
  LeaderboardPeriod,
  LeaderboardScope,
} from "@/core/domain/entities/leaderboard.entity";

export interface LevelProgressResponseDto {
  key: string;
  minPoints: number;
  nextLevelKey: string | null;
  nextLevelPoints: number | null;
  progressPercent: number;
}

export interface GamificationStateResponseDto {
  pointsBalance: number;
  currentStreak: number;
  longestStreak: number;
  profileCompletionPercent: number;
  badges: string[];
  newlyEarnedBadges: string[];
  level: LevelProgressResponseDto;
  pointsAwarded: number;
}

export interface BadgeCatalogItemResponseDto {
  key: string;
  category: BadgeCategory;
  tier: BadgeTier;
  threshold: number;
  bonusPoints: number;
  earned: boolean;
  earnedAt: string | null;
  progressCurrent: number;
}

export interface BadgeCatalogResponseDto {
  badges: BadgeCatalogItemResponseDto[];
  totalEarned: number;
  totalCount: number;
}

export interface LeaderboardEntryResponseDto {
  rank: number;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
  points: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResponseDto {
  entries: LeaderboardEntryResponseDto[];
  currentUserRank: number | null;
  scope: LeaderboardScope;
  period: LeaderboardPeriod;
}
