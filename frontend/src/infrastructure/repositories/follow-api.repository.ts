import type { Follow } from "@/core/domain/entities/follow.entity";
import type { FollowCounts } from "@/core/domain/entities/follow-counts.entity";
import type { PaginatedFollows } from "@/core/domain/entities/paginated-follows.entity";
import { FollowRepository } from "@/core/domain/repositories/follow.repository";
import type {
  FollowCountsResponseDto,
  FollowResponseDto,
  FollowStatusResponseDto,
  PaginatedFollowsResponseDto,
} from "@/infrastructure/api/dto/follow-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { FollowMapper } from "@/infrastructure/mappers/follow.mapper";

export class FollowApiRepository extends FollowRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async follow(userId: string): Promise<Follow> {
    const response = await this.httpClient.request<FollowResponseDto>(
      `/follows/${userId}`,
      { method: "POST" },
    );
    return FollowMapper.fromApi(response);
  }

  async unfollow(userId: string): Promise<void> {
    await this.httpClient.request<void>(`/follows/${userId}`, {
      method: "DELETE",
    });
  }

  async getCounts(userId: string): Promise<FollowCounts> {
    const response = await this.httpClient.request<FollowCountsResponseDto>(
      `/follows/${userId}/counts`,
    );
    return FollowMapper.countsFromApi(response);
  }

  async isFollowing(userId: string): Promise<boolean> {
    const response = await this.httpClient.request<FollowStatusResponseDto>(
      `/follows/${userId}/status`,
    );
    return response.isFollowing;
  }

  async findFollowers(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedFollows> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await this.httpClient.request<PaginatedFollowsResponseDto>(
      `/follows/${userId}/followers?${params.toString()}`,
    );
    return FollowMapper.paginatedFromApi(response);
  }

  async findFollowing(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedFollows> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await this.httpClient.request<PaginatedFollowsResponseDto>(
      `/follows/${userId}/following?${params.toString()}`,
    );
    return FollowMapper.paginatedFromApi(response);
  }
}
