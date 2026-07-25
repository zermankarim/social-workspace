import type { BadgeCatalog } from "@/core/domain/entities/badge-catalog.entity";
import type { GamificationState } from "@/core/domain/entities/gamification-state.entity";
import type {
  Leaderboard,
  LeaderboardPeriod,
  LeaderboardScope,
} from "@/core/domain/entities/leaderboard.entity";
import type { GamificationRepository } from "@/core/domain/repositories/gamification.repository";

export class GamificationService {
  constructor(
    private readonly gamificationRepository: GamificationRepository,
  ) {}

  checkIn(): Promise<GamificationState> {
    return this.gamificationRepository.checkIn();
  }

  getBadgeCatalog(): Promise<BadgeCatalog> {
    return this.gamificationRepository.getBadgeCatalog();
  }

  getLeaderboard(
    scope: LeaderboardScope,
    period: LeaderboardPeriod,
  ): Promise<Leaderboard> {
    return this.gamificationRepository.getLeaderboard(scope, period);
  }
}
