export class GamificationState {
  constructor(
    public readonly pointsBalance: number,
    public readonly currentStreak: number,
    public readonly longestStreak: number,
    public readonly profileCompletionPercent: number,
    public readonly badges: string[],
    public readonly pointsAwarded: number,
  ) {}
}
