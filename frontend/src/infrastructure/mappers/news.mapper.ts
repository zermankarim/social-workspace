import { NewsStory } from "@/core/domain/entities/news-story.entity";
import type { NewsStoryResponseDto } from "@/infrastructure/api/dto/news-response.dto";

export class NewsMapper {
  static fromApi(dto: NewsStoryResponseDto): NewsStory {
    return new NewsStory(
      dto.id,
      dto.title,
      dto.summary,
      dto.body ?? null,
      dto.url,
      dto.readersCount,
      new Date(dto.createdAt),
    );
  }
}
