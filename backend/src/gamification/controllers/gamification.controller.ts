import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GamificationService } from '../services/gamification.service';
import { GamificationStateResponseDto } from '../dto/gamification-state.dto';
import { BadgeCatalogResponseDto } from '../dto/badge-catalog.dto';
import {
  LeaderboardQueryDto,
  LeaderboardResponseDto,
} from '../dto/leaderboard.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Gamification')
@Controller('gamification')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post('check-in')
  @ApiOperation({
    summary: 'Record daily activity and sync points/streak/badges/level',
    description:
      'Idempotent per calendar day — safe to call on every app load. ' +
      'Advances the streak at most once per day and awards points for any ' +
      'profile-completion criteria newly satisfied.',
  })
  @ApiOkResponse({ type: GamificationStateResponseDto })
  checkIn(
    @Req() req: RequestWithJwtPayload,
  ): Promise<GamificationStateResponseDto> {
    return this.gamificationService.checkIn(req.user.userId);
  }

  @Get('badges')
  @ApiOperation({
    summary: 'Full achievement catalog with earned status and progress',
  })
  @ApiOkResponse({ type: BadgeCatalogResponseDto })
  getBadges(
    @Req() req: RequestWithJwtPayload,
  ): Promise<BadgeCatalogResponseDto> {
    return this.gamificationService.getBadgeCatalog(req.user.userId);
  }

  @Get('leaderboard')
  @ApiOperation({
    summary: 'Points leaderboard, scoped to your network or global',
  })
  @ApiOkResponse({ type: LeaderboardResponseDto })
  getLeaderboard(
    @Req() req: RequestWithJwtPayload,
    @Query() query: LeaderboardQueryDto,
  ): Promise<LeaderboardResponseDto> {
    return this.gamificationService.getLeaderboard(req.user.userId, query);
  }
}
