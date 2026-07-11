import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { CommentsService } from '../services/comments.service';
import { CommentResponseDto } from '../dto/comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a comment',
    description:
      'Updates comment text and/or replaces attachments. Only the author can update. ' +
      'Omit a field to leave it unchanged. Passing `attachments` replaces the full list.',
  })
  @ApiOkResponse({ type: CommentResponseDto })
  @ApiBadRequestResponse({
    description:
      'Invalid id/body, or update would leave the comment without text and attachments',
  })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @ApiForbiddenResponse({ description: 'Not the comment author' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  updateComment(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) commentId: string,
    @Body() body: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentsService.updateComment(req.user.userId, commentId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a comment',
    description:
      'Deletes a comment with the given id. Only the author can delete.',
  })
  @ApiNoContentResponse({ description: 'Comment deleted' })
  @ApiBadRequestResponse({
    description: 'Invalid comment id (must be UUID)',
  })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @ApiForbiddenResponse({ description: 'Not the comment author' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  deleteComment(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) commentId: string,
  ): Promise<void> {
    return this.commentsService.deleteComment(req.user.userId, commentId);
  }
}
