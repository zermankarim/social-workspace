import type { BadgeCatalog } from "@/core/domain/entities/badge-catalog.entity";
import type { GamificationState } from "@/core/domain/entities/gamification-state.entity";
import type {
  Leaderboard,
  LeaderboardPeriod,
  LeaderboardScope,
} from "@/core/domain/entities/leaderboard.entity";

export abstract class GamificationRepository {
  abstract checkIn(): Promise<GamificationState>;
  abstract getBadgeCatalog(): Promise<BadgeCatalog>;
  abstract getLeaderboard(
    scope: LeaderboardScope,
    period: LeaderboardPeriod,
  ): Promise<Leaderboard>;
}
