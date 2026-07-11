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
