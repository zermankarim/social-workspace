import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LikesRepository } from '../repositories/likes.repository';
import { LikeResponseDto } from '../dto/like.dto';
import { UpsertLikeDto } from '../dto/upsert-like.dto';
import { PaginatedLikesQueryDto } from '../dto/paginated-likes-query.dto';
import { LikesMapper } from '../mappers/likes.mapper';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { POST_LIKE_RECEIVED_EVENT } from '../../gamification/events/gamification.events';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async getLikesByPostIdPaginated(
    postId: string,
    query: PaginatedLikesQueryDto,
  ): Promise<PaginatedResponseDto<LikeResponseDto>> {
    await this.assertPostExists(postId);

    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [likes, total] = await Promise.all([
      this.likesRepository.findManyByPostId(postId, skip, take),
      this.likesRepository.countByPostId(postId),
    ]);

    return {
      data: likes.map((like) => LikesMapper.toLikeResponseDto(like)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async upsertLike(
    authorId: string,
    postId: string,
    dto: UpsertLikeDto,
  ): Promise<LikeResponseDto> {
    await this.assertPostExists(postId);

    const { like, created, postAuthorId } =
      await this.likesRepository.upsertLike(postId, authorId, dto.likeType);

    if (created) {
      await this.notificationsService.notifyPostInteraction(
        authorId,
        postId,
        NotificationType.POST_LIKE,
      );
      if (postAuthorId) {
        this.eventEmitter.emit(POST_LIKE_RECEIVED_EVENT, {
          recipientId: postAuthorId,
          actorId: authorId,
          postId,
        });
      }
    }

    return LikesMapper.toLikeResponseDto(like);
  }

  public async deleteLike(authorId: string, postId: string): Promise<void> {
    await this.assertPostExists(postId);
    await this.likesRepository.deleteLikeByPostAndAuthor(postId, authorId);
  }

  private async assertPostExists(postId: string): Promise<void> {
    const exists = await this.likesRepository.postExists(postId);
    if (!exists) {
      throw new NotFoundException('Post not found');
    }
  }
}
