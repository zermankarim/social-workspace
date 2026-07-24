import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowsRepository } from '../repositories/follows.repository';
import { FollowsMapper } from '../mappers/follows.mapper';
import {
  FollowCountsResponseDto,
  FollowResponseDto,
  FollowStatusResponseDto,
} from '../dto/follow.dto';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class FollowsService {
  constructor(
    private readonly followsRepository: FollowsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  public async follow(
    followerId: string,
    followingId: string,
  ): Promise<FollowResponseDto> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const exists = await this.followsRepository.userExists(followingId);
    if (!exists) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.followsRepository.findByPair(
      followerId,
      followingId,
    );
    if (existing) {
      throw new ConflictException('Already following this user');
    }

    const follow = await this.followsRepository.create(followerId, followingId);
    await this.notificationsService.notifyNewFollower(followerId, followingId);
    return FollowsMapper.toResponseDto(follow);
  }

  public async unfollow(
    followerId: string,
    followingId: string,
  ): Promise<void> {
    const removed = await this.followsRepository.deleteByPair(
      followerId,
      followingId,
    );
    if (!removed) {
      throw new NotFoundException('Not following this user');
    }
  }

  public async getCounts(userId: string): Promise<FollowCountsResponseDto> {
    const [followersCount, followingCount] = await Promise.all([
      this.followsRepository.countFollowers(userId),
      this.followsRepository.countFollowing(userId),
    ]);
    return { followersCount, followingCount };
  }

  public async getStatus(
    viewerId: string,
    targetUserId: string,
  ): Promise<FollowStatusResponseDto> {
    const existing = await this.followsRepository.findByPair(
      viewerId,
      targetUserId,
    );
    return { isFollowing: existing !== null };
  }

  public async getFollowers(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<FollowResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [items, total] = await Promise.all([
      this.followsRepository.findFollowers(userId, skip, take),
      this.followsRepository.countFollowers(userId),
    ]);

    return {
      data: items.map((item) => FollowsMapper.toResponseDto(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async getFollowing(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<FollowResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [items, total] = await Promise.all([
      this.followsRepository.findFollowing(userId, skip, take),
      this.followsRepository.countFollowing(userId),
    ]);

    return {
      data: items.map((item) => FollowsMapper.toResponseDto(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }
}
