import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType, Prisma } from '@prisma/client';
import { CommentsRepository } from '../repositories/comments.repository';
import { CommentResponseDto } from '../dto/comment.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { PaginatedCommentsQueryDto } from '../dto/paginated-comments-query.dto';
import { CommentsMapper } from '../mappers/comments.mapper';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { CommentSelected } from '../comment.select';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  public async getCommentsByPostIdPaginated(
    postId: string,
    query: PaginatedCommentsQueryDto,
  ): Promise<PaginatedResponseDto<CommentResponseDto>> {
    await this.assertPostExists(postId);

    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [comments, total] = await Promise.all([
      this.commentsRepository.findManyByPostId(postId, skip, take),
      this.commentsRepository.countByPostId(postId),
    ]);

    return {
      data: comments.map((comment) =>
        CommentsMapper.toCommentResponseDto(comment),
      ),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async createComment(
    authorId: string,
    postId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    await this.assertPostExists(postId);

    const comment = await this.commentsRepository.createComment(
      postId,
      authorId,
      {
        textContent: dto.textContent,
        attachments: dto.attachments,
      },
    );

    await this.notificationsService.notifyPostInteraction(
      authorId,
      postId,
      NotificationType.POST_COMMENT,
    );

    return CommentsMapper.toCommentResponseDto(comment);
  }

  public async updateComment(
    userId: string,
    commentId: string,
    dto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.getOwnedCommentOrThrow(userId, commentId);

    const nextTextContent =
      dto.textContent !== undefined ? dto.textContent : comment.textContent;
    const nextAttachments =
      dto.attachments !== undefined ? dto.attachments : comment.attachments;

    this.assertCommentHasContent(nextTextContent, nextAttachments.length);

    const data: Prisma.PostCommentUpdateInput = {
      ...(dto.textContent !== undefined && { textContent: dto.textContent }),
      ...(dto.attachments !== undefined && {
        attachments: {
          deleteMany: {},
          create: dto.attachments,
        },
      }),
    };

    const updated = await this.commentsRepository.updateCommentById(
      commentId,
      data,
    );
    return CommentsMapper.toCommentResponseDto(updated);
  }

  public async deleteComment(userId: string, commentId: string): Promise<void> {
    const comment = await this.getOwnedCommentOrThrow(userId, commentId);
    await this.commentsRepository.deleteCommentById(commentId, comment.postId);
  }

  private async assertPostExists(postId: string): Promise<void> {
    const exists = await this.commentsRepository.postExists(postId);
    if (!exists) {
      throw new NotFoundException('Post not found');
    }
  }

  private async getOwnedCommentOrThrow(
    userId: string,
    commentId: string,
  ): Promise<CommentSelected> {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.author.id !== userId) {
      throw new ForbiddenException('You are not the author of this comment');
    }
    return comment;
  }

  private assertCommentHasContent(
    textContent: string | null | undefined,
    attachmentsCount: number,
  ): void {
    const hasText =
      typeof textContent === 'string' && textContent.trim().length > 0;
    if (!hasText && attachmentsCount === 0) {
      throw new BadRequestException(
        'Comment must include non-empty textContent or at least one attachment',
      );
    }
  }
}
