import type { GamificationState } from "@/core/domain/entities/gamification-state.entity";
import type { GamificationRepository } from "@/core/domain/repositories/gamification.repository";

export class GamificationService {
  constructor(
    private readonly gamificationRepository: GamificationRepository,
  ) {}

  checkIn(): Promise<GamificationState> {
    return this.gamificationRepository.checkIn();
  }
}
