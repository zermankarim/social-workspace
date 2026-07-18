import { HashtagService } from "@/core/application/services/hashtag.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { HashtagApiRepository } from "@/infrastructure/repositories/hashtag-api.repository";

export class HashtagModule {
  static create(httpClient: HttpClient): HashtagService {
    const repository = new HashtagApiRepository(httpClient);
    return new HashtagService(repository);
  }
}
