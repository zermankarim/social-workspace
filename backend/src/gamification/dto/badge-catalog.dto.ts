import { ApiProperty } from '@nestjs/swagger';
import type { BadgeCategory, BadgeTier } from '../constants/badges.constants';

export class BadgeCatalogItemDto {
  @ApiProperty({ example: 'connections_50' })
  key: string;

  @ApiProperty({ example: 'connections' })
  category: BadgeCategory;

  @ApiProperty({
    example: 'silver',
    enum: ['bronze', 'silver', 'gold', 'platinum'],
  })
  tier: BadgeTier;

  @ApiProperty({ example: 50 })
  threshold: number;

  @ApiProperty({ example: 25 })
  bonusPoints: number;

  @ApiProperty({ example: true })
  earned: boolean;

  @ApiProperty({ example: '2026-06-01T12:00:00.000Z', nullable: true })
  earnedAt: Date | null;

  @ApiProperty({
    example: 32,
    description:
      'Current value of the underlying stat (e.g. connections count), for progress bars on locked badges.',
  })
  progressCurrent: number;
}

export class BadgeCatalogResponseDto {
  @ApiProperty({ type: [BadgeCatalogItemDto] })
  badges: BadgeCatalogItemDto[];

  @ApiProperty({ example: 6 })
  totalEarned: number;

  @ApiProperty({ example: 30 })
  totalCount: number;
}
