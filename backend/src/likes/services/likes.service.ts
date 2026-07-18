import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
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

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly notificationsService: NotificationsService,
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

    const { like, created } = await this.likesRepository.upsertLike(
      postId,
      authorId,
      dto.likeType,
    );

    if (created) {
      await this.notificationsService.notifyPostInteraction(
        authorId,
        postId,
        NotificationType.POST_LIKE,
      );
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
