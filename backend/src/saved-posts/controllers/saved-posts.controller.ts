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
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SavedPostsService } from '../services/saved-posts.service';
import { PaginatedPostsResponseDto } from '../../posts/dto/paginated-posts-response.dto';
import { PostResponseDto } from '../../posts/dto/post.dto';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Saved posts')
@Controller('saved-posts')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({ description: 'Missing or invalid access_token' })
export class SavedPostsController {
  constructor(private readonly savedPostsService: SavedPostsService) {}

  @Get()
  @ApiOperation({
    summary: 'List posts saved by the current user (paginated)',
    description: 'Newest saved first. Supports `page` and `limit`.',
  })
  @ApiOkResponse({ type: PaginatedPostsResponseDto })
  list(
    @Req() req: RequestWithJwtPayload,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    return this.savedPostsService.list(req.user.userId, query);
  }

  @Post(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Save a post',
    description: 'Idempotent: saving an already-saved post is a no-op.',
  })
  @ApiNoContentResponse({ description: 'Post saved' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  save(
    @Req() req: RequestWithJwtPayload,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<void> {
    return this.savedPostsService.save(req.user.userId, postId);
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove a post from saved',
    description: 'Idempotent: unsaving a non-saved post is a no-op.',
  })
  @ApiNoContentResponse({ description: 'Post removed from saved' })
  unsave(
    @Req() req: RequestWithJwtPayload,
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<void> {
    return this.savedPostsService.unsave(req.user.userId, postId);
  }
}
