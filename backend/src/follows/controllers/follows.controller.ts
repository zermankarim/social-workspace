import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FollowsService } from '../services/follows.service';
import {
  FollowCountsResponseDto,
  FollowResponseDto,
  FollowStatusResponseDto,
} from '../dto/follow.dto';
import { PaginatedFollowsResponseDto } from '../dto/paginated-follows-response.dto';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Follows')
@Controller('follows')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Follow a user (one-way, no approval needed)' })
  @ApiCreatedResponse({ type: FollowResponseDto })
  @ApiBadRequestResponse({ description: 'Cannot follow yourself' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'Already following this user' })
  follow(
    @Req() req: RequestWithJwtPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<FollowResponseDto> {
    return this.followsService.follow(req.user.userId, userId);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiNoContentResponse({ description: 'Unfollowed' })
  @ApiNotFoundResponse({ description: 'Not following this user' })
  unfollow(
    @Req() req: RequestWithJwtPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    return this.followsService.unfollow(req.user.userId, userId);
  }

  @Get(':userId/followers')
  @ApiOperation({ summary: "List a user's followers (paginated)" })
  @ApiOkResponse({ type: PaginatedFollowsResponseDto })
  getFollowers(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<FollowResponseDto>> {
    return this.followsService.getFollowers(userId, query);
  }

  @Get(':userId/following')
  @ApiOperation({ summary: 'List who a user follows (paginated)' })
  @ApiOkResponse({ type: PaginatedFollowsResponseDto })
  getFollowing(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<FollowResponseDto>> {
    return this.followsService.getFollowing(userId, query);
  }

  @Get(':userId/counts')
  @ApiOperation({ summary: 'Followers/following counts for a user' })
  @ApiOkResponse({ type: FollowCountsResponseDto })
  getCounts(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<FollowCountsResponseDto> {
    return this.followsService.getCounts(userId);
  }

  @Get(':userId/status')
  @ApiOperation({ summary: 'Whether the current user follows this user' })
  @ApiOkResponse({ type: FollowStatusResponseDto })
  getStatus(
    @Req() req: RequestWithJwtPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<FollowStatusResponseDto> {
    return this.followsService.getStatus(req.user.userId, userId);
  }
}
