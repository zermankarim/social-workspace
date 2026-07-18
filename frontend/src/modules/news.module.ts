import { NewsService } from "@/core/application/services/news.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { NewsApiRepository } from "@/infrastructure/repositories/news-api.repository";

export class NewsModule {
  static create(httpClient: HttpClient): NewsService {
    return new NewsService(new NewsApiRepository(httpClient));
  }
}
