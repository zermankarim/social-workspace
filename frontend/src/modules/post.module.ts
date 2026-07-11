import { PostService } from "@/core/application/services/post.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { PostApiRepository } from "@/infrastructure/repositories/post-api.repository";

export class PostModule {
  static create(httpClient: HttpClient): PostService {
    const repository = new PostApiRepository(httpClient);
    return new PostService(repository);
  }
}
