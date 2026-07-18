import type { NewsStory } from "@/core/domain/entities/news-story.entity";

export type CreateNewsStoryInput = {
  title: string;
  summary?: string;
  body?: string;
  url?: string;
};

export abstract class NewsRepository {
  abstract list(limit?: number): Promise<NewsStory[]>;
  abstract findById(id: string): Promise<NewsStory>;
  abstract create(input: CreateNewsStoryInput): Promise<NewsStory>;
  abstract registerRead(id: string): Promise<NewsStory>;
}
