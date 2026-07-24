import { ApiProperty } from '@nestjs/swagger';

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
      'Computed milestone badge keys — see BADGE_DEFINITIONS on the frontend for labels/icons.',
  })
  badges: string[];

  @ApiProperty({
    example: 5,
    description:
      'Points earned by this check-in call (0 if already checked in today and no new profile criteria).',
  })
  pointsAwarded: number;
}
