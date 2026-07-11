import { CommentService } from "@/core/application/services/comment.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { CommentApiRepository } from "@/infrastructure/repositories/comment-api.repository";

export class CommentModule {
  static create(httpClient: HttpClient): CommentService {
    return new CommentService(new CommentApiRepository(httpClient));
  }
}
