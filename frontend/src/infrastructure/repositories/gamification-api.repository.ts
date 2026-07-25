import { BadgeCatalog } from "@/core/domain/entities/badge-catalog.entity";
import { GamificationState } from "@/core/domain/entities/gamification-state.entity";
import {
  Leaderboard,
  LeaderboardPeriod,
  LeaderboardScope,
} from "@/core/domain/entities/leaderboard.entity";
import { GamificationRepository } from "@/core/domain/repositories/gamification.repository";
import type {
  BadgeCatalogResponseDto,
  GamificationStateResponseDto,
  LeaderboardResponseDto,
} from "@/infrastructure/api/dto/gamification-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { GamificationMapper } from "@/infrastructure/mappers/gamification.mapper";

export class GamificationApiRepository extends GamificationRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async checkIn(): Promise<GamificationState> {
    const response =
      await this.httpClient.request<GamificationStateResponseDto>(
        "/gamification/check-in",
        { method: "POST" },
      );
    return GamificationMapper.stateFromApi(response);
  }

  async getBadgeCatalog(): Promise<BadgeCatalog> {
    const response = await this.httpClient.request<BadgeCatalogResponseDto>(
      "/gamification/badges",
    );
    return GamificationMapper.badgeCatalogFromApi(response);
  }

  async getLeaderboard(
    scope: LeaderboardScope,
    period: LeaderboardPeriod,
  ): Promise<Leaderboard> {
    const params = new URLSearchParams({ scope, period });
    const response = await this.httpClient.request<LeaderboardResponseDto>(
      `/gamification/leaderboard?${params.toString()}`,
    );
    return GamificationMapper.leaderboardFromApi(response);
  }
}
