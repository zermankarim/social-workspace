import { LevelProgress } from "@/core/domain/entities/level-progress.entity";

export class GamificationState {
  constructor(
    public readonly pointsBalance: number,
    public readonly currentStreak: number,
    public readonly longestStreak: number,
    public readonly profileCompletionPercent: number,
    public readonly badges: string[],
    public readonly newlyEarnedBadges: string[],
    public readonly level: LevelProgress,
    public readonly pointsAwarded: number,
  ) {}
}
