import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileViewsService } from '../services/profile-views.service';
import { ProfileViewsCountResponseDto } from '../dto/profile-views-count-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Profile views')
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
@UseGuards(JwtAuthGuard)
@Controller('profile-views')
export class ProfileViewsController {
  constructor(private readonly profileViewsService: ProfileViewsService) {}

  @Get('count')
  @ApiOperation({
    summary: 'Count of people who viewed my profile',
  })
  @ApiOkResponse({ type: ProfileViewsCountResponseDto })
  async getMyViewersCount(
    @Req() req: RequestWithJwtPayload,
  ): Promise<ProfileViewsCountResponseDto> {
    const count = await this.profileViewsService.getViewersCount(
      req.user.userId,
    );
    return { count };
  }

  @Post(':profileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Record that the current user viewed a profile',
    description:
      'No-op for self-views. Sends a one-time notification on the first view.',
  })
  @ApiNoContentResponse({ description: 'View recorded' })
  recordView(
    @Req() req: RequestWithJwtPayload,
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ): Promise<void> {
    return this.profileViewsService.recordView(req.user.userId, profileId);
  }
}
