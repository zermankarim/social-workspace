import { Follow } from "@/core/domain/entities/follow.entity";
import { FollowCounts } from "@/core/domain/entities/follow-counts.entity";
import { FollowUser } from "@/core/domain/entities/follow-user.entity";
import { PaginatedFollows } from "@/core/domain/entities/paginated-follows.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type {
  FollowCountsResponseDto,
  FollowResponseDto,
  FollowUserResponseDto,
  PaginatedFollowsResponseDto,
} from "@/infrastructure/api/dto/follow-response.dto";

export class FollowMapper {
  static userFromApi(dto: FollowUserResponseDto): FollowUser {
    return new FollowUser(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.headline,
      dto.avatarUrl,
    );
  }

  static fromApi(dto: FollowResponseDto): Follow {
    return new Follow(
      dto.id,
      this.userFromApi(dto.follower),
      this.userFromApi(dto.following),
      new Date(dto.createdAt),
    );
  }

  static countsFromApi(dto: FollowCountsResponseDto): FollowCounts {
    return new FollowCounts(dto.followersCount, dto.followingCount);
  }

  static paginatedFromApi(dto: PaginatedFollowsResponseDto): PaginatedFollows {
    return new PaginatedFollows(
      dto.data.map((item) => this.fromApi(item)),
      new PaginationMeta(
        dto.meta.page,
        dto.meta.limit,
        dto.meta.total,
        dto.meta.totalPages,
        dto.meta.hasNextPage,
        dto.meta.hasPrevPage,
      ),
    );
  }
}
