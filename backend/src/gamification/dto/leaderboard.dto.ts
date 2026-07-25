import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum LeaderboardScope {
  NETWORK = 'network',
  GLOBAL = 'global',
}

export enum LeaderboardPeriod {
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all',
}

export class LeaderboardQueryDto {
  @ApiPropertyOptional({
    enum: LeaderboardScope,
    default: LeaderboardScope.NETWORK,
  })
  @IsOptional()
  @IsEnum(LeaderboardScope)
  scope?: LeaderboardScope = LeaderboardScope.NETWORK;

  @ApiPropertyOptional({
    enum: LeaderboardPeriod,
    default: LeaderboardPeriod.WEEK,
  })
  @IsOptional()
  @IsEnum(LeaderboardPeriod)
  period?: LeaderboardPeriod = LeaderboardPeriod.WEEK;
}

export class LeaderboardEntryDto {
  @ApiProperty({ example: 1 })
  rank: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;

  @ApiProperty({ example: 240 })
  points: number;

  @ApiProperty({ example: false })
  isCurrentUser: boolean;
}

export class LeaderboardResponseDto {
  @ApiProperty({ type: [LeaderboardEntryDto] })
  entries: LeaderboardEntryDto[];

  @ApiPropertyOptional({ example: 4, nullable: true })
  currentUserRank: number | null;

  @ApiProperty({ enum: LeaderboardScope })
  scope: LeaderboardScope;

  @ApiProperty({ enum: LeaderboardPeriod })
  period: LeaderboardPeriod;
}
