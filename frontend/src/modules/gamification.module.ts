import { GamificationService } from "@/core/application/services/gamification.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { GamificationApiRepository } from "@/infrastructure/repositories/gamification-api.repository";

export class GamificationModule {
  static create(httpClient: HttpClient): GamificationService {
    return new GamificationService(new GamificationApiRepository(httpClient));
  }
}
