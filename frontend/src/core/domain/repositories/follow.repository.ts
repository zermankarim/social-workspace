import type { Follow } from "@/core/domain/entities/follow.entity";
import type { FollowCounts } from "@/core/domain/entities/follow-counts.entity";
import type { PaginatedFollows } from "@/core/domain/entities/paginated-follows.entity";

export abstract class FollowRepository {
  abstract follow(userId: string): Promise<Follow>;
  abstract unfollow(userId: string): Promise<void>;
  abstract getCounts(userId: string): Promise<FollowCounts>;
  abstract isFollowing(userId: string): Promise<boolean>;
  abstract findFollowers(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedFollows>;
  abstract findFollowing(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedFollows>;
}
