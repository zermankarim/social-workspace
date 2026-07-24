import type { Follow } from "@/core/domain/entities/follow.entity";
import type { FollowCounts } from "@/core/domain/entities/follow-counts.entity";
import type { PaginatedFollows } from "@/core/domain/entities/paginated-follows.entity";
import type { FollowRepository } from "@/core/domain/repositories/follow.repository";

export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  follow(userId: string): Promise<Follow> {
    return this.followRepository.follow(userId);
  }

  unfollow(userId: string): Promise<void> {
    return this.followRepository.unfollow(userId);
  }

  getCounts(userId: string): Promise<FollowCounts> {
    return this.followRepository.getCounts(userId);
  }

  isFollowing(userId: string): Promise<boolean> {
    return this.followRepository.isFollowing(userId);
  }

  getFollowers(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedFollows> {
    return this.followRepository.findFollowers(userId, page, limit);
  }

  getFollowing(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedFollows> {
    return this.followRepository.findFollowing(userId, page, limit);
  }
}
