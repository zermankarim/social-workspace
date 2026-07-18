import { NewsStory } from "@/core/domain/entities/news-story.entity";
import {
  NewsRepository,
  type CreateNewsStoryInput,
} from "@/core/domain/repositories/news.repository";
import type {
  CreateNewsStoryRequestDto,
  NewsStoryResponseDto,
} from "@/infrastructure/api/dto/news-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { NewsMapper } from "@/infrastructure/mappers/news.mapper";

export class NewsApiRepository extends NewsRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async list(limit = 10): Promise<NewsStory[]> {
    const params = new URLSearchParams({ limit: String(limit) });
    const response = await this.httpClient.request<NewsStoryResponseDto[]>(
      `/news?${params.toString()}`,
    );
    return response.map((item) => NewsMapper.fromApi(item));
  }

  async findById(id: string): Promise<NewsStory> {
    const response = await this.httpClient.request<NewsStoryResponseDto>(
      `/news/${id}`,
    );
    return NewsMapper.fromApi(response);
  }

  async create(input: CreateNewsStoryInput): Promise<NewsStory> {
    const body: CreateNewsStoryRequestDto = {
      title: input.title,
      summary: input.summary,
      body: input.body,
      url: input.url,
    };
    const response = await this.httpClient.request<NewsStoryResponseDto>(
      `/news`,
      { method: "POST", body },
    );
    return NewsMapper.fromApi(response);
  }

  async registerRead(id: string): Promise<NewsStory> {
    const response = await this.httpClient.request<NewsStoryResponseDto>(
      `/news/${id}/read`,
      { method: "POST" },
    );
    return NewsMapper.fromApi(response);
  }
}
