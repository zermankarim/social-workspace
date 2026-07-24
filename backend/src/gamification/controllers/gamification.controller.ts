import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GamificationService } from '../services/gamification.service';
import { GamificationStateResponseDto } from '../dto/gamification-state.dto';
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
    summary: 'Record daily activity and sync points/streak/badges',
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
}
