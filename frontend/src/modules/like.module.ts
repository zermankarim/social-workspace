import { LikeService } from "@/core/application/services/like.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { LikeApiRepository } from "@/infrastructure/repositories/like-api.repository";

export class LikeModule {
  static create(httpClient: HttpClient): LikeService {
    return new LikeService(new LikeApiRepository(httpClient));
  }
}
