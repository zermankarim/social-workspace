export interface GamificationStateResponseDto {
  pointsBalance: number;
  currentStreak: number;
  longestStreak: number;
  profileCompletionPercent: number;
  badges: string[];
  pointsAwarded: number;
}
