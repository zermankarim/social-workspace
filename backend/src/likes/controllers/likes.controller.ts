import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LikesService } from '../services/likes.service';
import { PaginatedLikesQueryDto } from '../dto/paginated-likes-query.dto';
import { PaginatedLikesResponseDto } from '../dto/paginated-likes-response.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { LikeResponseDto } from '../dto/like.dto';
import { UpsertLikeDto } from '../dto/upsert-like.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Likes')
@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  @ApiOperation({
    summary: 'List likes for a post (paginated)',
    description:
      'Returns a page of reactions for the given post, newest first. ' +
      'Supports `page` and `limit` for infinite scroll / load more.',
  })
  @ApiOkResponse({ type: PaginatedLikesResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid post id or query parameters (page, limit)',
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  getLikesByPostIdPaginated(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: PaginatedLikesQueryDto,
  ): Promise<PaginatedResponseDto<LikeResponseDto>> {
    return this.likesService.getLikesByPostIdPaginated(postId, query);
  }

  @Put()
  @ApiOperation({
    summary: 'Set or change reaction on a post',
    description:
      'Creates a reaction or updates the reaction type for the current user. ' +
      'One reaction per user per post.',
  })
  @ApiOkResponse({ type: LikeResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid post id or request body',
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  upsertLike(
    @Req() req: RequestWithJwtPayload,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() body: UpsertLikeDto,
  ): Promise<LikeResponseDto> {
    return this.likesService.upsertLike(req.user.userId, postId, body);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove own reaction from a post',
    description:
      'Removes the current user reaction if present. Idempotent (204 even if none).',
  })
  @ApiNoContentResponse({ description: 'Reaction removed (or already absent)' })
  @ApiBadRequestResponse({
    description: 'Invalid post id (must be UUID)',
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  deleteLike(
    @Req() req: RequestWithJwtPayload,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<void> {
    return this.likesService.deleteLike(req.user.userId, postId);
  }
}
