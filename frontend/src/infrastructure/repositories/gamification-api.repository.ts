import { GamificationState } from "@/core/domain/entities/gamification-state.entity";
import { GamificationRepository } from "@/core/domain/repositories/gamification.repository";
import type { GamificationStateResponseDto } from "@/infrastructure/api/dto/gamification-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";

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
    return new GamificationState(
      response.pointsBalance,
      response.currentStreak,
      response.longestStreak,
      response.profileCompletionPercent,
      response.badges,
      response.pointsAwarded,
    );
  }
}
