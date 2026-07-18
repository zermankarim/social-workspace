import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostsService } from '../services/posts.service';
import { PaginatedPostsByAuthorQueryDto } from '../dto/paginated-posts-by-author-query.dto';
import { PaginatedPostsFeedQueryDto } from '../dto/paginated-posts-feed-query.dto';
import { PaginatedPostsResponseDto } from '../dto/paginated-posts-response.dto';
import { PostSearchQueryDto } from '../dto/post-search-query.dto';
import { CreateRepostDto } from '../dto/create-repost.dto';
import { RegisterImpressionsDto } from '../dto/register-impressions.dto';
import { ImpressionsSummaryResponseDto } from '../dto/impressions-summary-response.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { PostResponseDto } from '../dto/post.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({
    summary: 'News feed (paginated)',
    description:
      'Returns a page of all posts, newest first. ' +
      'Supports `page` and `limit` for infinite scroll / pagination.',
  })
  @ApiOkResponse({ type: PaginatedPostsResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters (page, limit)',
  })
  getFeedPaginated(
    @Query() query: PaginatedPostsFeedQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    return this.postsService.getFeedPaginated(query);
  }

  @Get('by-author')
  @ApiOperation({
    summary: 'List posts by author (paginated)',
    description:
      'Returns a page of posts for the given authorId, newest first. ' +
      'Supports `page` and `limit` for infinite scroll / pagination.',
  })
  @ApiOkResponse({ type: PaginatedPostsResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters (authorId, page, limit)',
  })
  getPostsByAuthorIdPaginated(
    @Query() query: PaginatedPostsByAuthorQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    return this.postsService.getPostsByAuthorIdPaginated(query);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search posts by text (paginated)',
    description:
      'Case-insensitive search over post text, newest first. ' +
      'Empty `q` returns an empty page.',
  })
  @ApiOkResponse({ type: PaginatedPostsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters (q, page)' })
  searchPosts(
    @Query() query: PostSearchQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    return this.postsService.searchPosts(query);
  }

  @Get('impressions/summary')
  @ApiOperation({
    summary: 'Total impressions across my posts',
    description: 'Sums impressions of every post authored by the current user.',
  })
  @ApiOkResponse({ type: ImpressionsSummaryResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  async getImpressionsSummary(
    @Req() req: RequestWithJwtPayload,
  ): Promise<ImpressionsSummaryResponseDto> {
    const impressionsCount = await this.postsService.getImpressionsSummary(
      req.user.userId,
    );
    return { impressionsCount };
  }

  @Post('impressions')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Register post impressions',
    description:
      'Counts each (viewer, post) pair at most once and skips the ' +
      "viewer's own posts. Called when post cards become visible.",
  })
  @ApiNoContentResponse({ description: 'Impressions registered' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  registerImpressions(
    @Req() req: RequestWithJwtPayload,
    @Body() body: RegisterImpressionsDto,
  ): Promise<void> {
    return this.postsService.registerImpressions(req.user.userId, body.postIds);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a post by id',
    description: 'Returns a post with the given id.',
  })
  @ApiOkResponse({ type: PostResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid post id (must be UUID)',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  getPostById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PostResponseDto> {
    return this.postsService.getPostById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Creates a new post with the given text and attachments.',
  })
  @ApiOkResponse({ type: PostResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid request body',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  createPost(
    @Req() req: RequestWithJwtPayload,
    @Body() body: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postsService.createPost(req.user.userId, body);
  }

  @Post(':id/repost')
  @ApiOperation({
    summary: 'Repost a post (optionally with a quote)',
    description:
      'Creates a new post that references the original. Reposting a repost ' +
      'references the underlying original. Add `textContent` for a quote repost.',
  })
  @ApiOkResponse({ type: PostResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid post id or request body' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  createRepost(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() body: CreateRepostDto,
  ): Promise<PostResponseDto> {
    return this.postsService.createRepost(req.user.userId, postId, body);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post',
    description:
      'Updates post text and/or replaces attachments. Only the author can update. ' +
      'Omit a field to leave it unchanged. Passing `attachments` replaces the full list.',
  })
  @ApiOkResponse({ type: PostResponseDto })
  @ApiBadRequestResponse({
    description:
      'Invalid id/body, or update would leave the post without text and attachments',
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiForbiddenResponse({ description: 'Not the post author' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  updatePost(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() body: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postsService.updatePost(req.user.userId, postId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a post',
    description:
      'Deletes a post with the given id. Only the author can delete.',
  })
  @ApiNoContentResponse({ description: 'Post deleted' })
  @ApiBadRequestResponse({
    description: 'Invalid post id (must be UUID)',
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiForbiddenResponse({ description: 'Not the post author' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  deletePost(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) postId: string,
  ): Promise<void> {
    return this.postsService.deletePost(req.user.userId, postId);
  }
}
