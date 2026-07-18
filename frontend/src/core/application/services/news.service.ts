import type { NewsStory } from "@/core/domain/entities/news-story.entity";
import type {
  CreateNewsStoryInput,
  NewsRepository,
} from "@/core/domain/repositories/news.repository";

export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  list(limit?: number): Promise<NewsStory[]> {
    return this.newsRepository.list(limit);
  }

  getById(id: string): Promise<NewsStory> {
    return this.newsRepository.findById(id);
  }

  create(input: CreateNewsStoryInput): Promise<NewsStory> {
    return this.newsRepository.create(input);
  }

  registerRead(id: string): Promise<NewsStory> {
    return this.newsRepository.registerRead(id);
  }
}
