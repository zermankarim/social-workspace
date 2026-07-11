import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { PaginatedCommentsQueryDto } from '../dto/paginated-comments-query.dto';
import { PaginatedCommentsResponseDto } from '../dto/paginated-comments-response.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { CommentResponseDto } from '../dto/comment.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Comments')
@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({
    summary: 'List comments for a post (paginated)',
    description:
      'Returns a page of comments for the given post, newest first. ' +
      'Supports `page` and `limit` for infinite scroll / load more.',
  })
  @ApiOkResponse({ type: PaginatedCommentsResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid post id or query parameters (page, limit)',
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  getCommentsByPostIdPaginated(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: PaginatedCommentsQueryDto,
  ): Promise<PaginatedResponseDto<CommentResponseDto>> {
    return this.commentsService.getCommentsByPostIdPaginated(postId, query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a comment on a post',
    description: 'Creates a comment with the given text and/or attachments.',
  })
  @ApiOkResponse({ type: CommentResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid post id or request body',
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  createComment(
    @Req() req: RequestWithJwtPayload,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() body: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.createComment(req.user.userId, postId, body);
  }
}
