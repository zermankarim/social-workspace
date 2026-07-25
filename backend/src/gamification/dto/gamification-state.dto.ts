import { ApiProperty } from '@nestjs/swagger';

export class LevelProgressDto {
  @ApiProperty({ example: 'contributor' })
  key: string;

  @ApiProperty({ example: 100 })
  minPoints: number;

  @ApiProperty({ example: 'active_member', nullable: true })
  nextLevelKey: string | null;

  @ApiProperty({ example: 500, nullable: true })
  nextLevelPoints: number | null;

  @ApiProperty({ example: 42 })
  progressPercent: number;
}

export class GamificationStateResponseDto {
  @ApiProperty({ example: 85 })
  pointsBalance: number;

  @ApiProperty({ example: 3 })
  currentStreak: number;

  @ApiProperty({ example: 12 })
  longestStreak: number;

  @ApiProperty({ example: 63 })
  profileCompletionPercent: number;

  @ApiProperty({
    type: [String],
    example: ['streak_7'],
    description:
      'All persisted, earned badge keys — see GET /gamification/badges for the full catalog with progress.',
  })
  badges: string[];

  @ApiProperty({
    type: [String],
    example: [],
    description:
      'Badge keys newly unlocked by this call — use to trigger a celebratory toast client-side.',
  })
  newlyEarnedBadges: string[];

  @ApiProperty({ type: LevelProgressDto })
  level: LevelProgressDto;

  @ApiProperty({
    example: 5,
    description:
      'Points earned by this check-in call (0 if already checked in today and no new profile criteria).',
  })
  pointsAwarded: number;
}
