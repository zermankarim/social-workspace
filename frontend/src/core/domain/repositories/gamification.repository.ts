import type { GamificationState } from "@/core/domain/entities/gamification-state.entity";

export abstract class GamificationRepository {
  abstract checkIn(): Promise<GamificationState>;
}
