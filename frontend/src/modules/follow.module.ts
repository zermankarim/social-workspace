import { FollowService } from "@/core/application/services/follow.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { FollowApiRepository } from "@/infrastructure/repositories/follow-api.repository";

export class FollowModule {
  static create(httpClient: HttpClient): FollowService {
    return new FollowService(new FollowApiRepository(httpClient));
  }
}
