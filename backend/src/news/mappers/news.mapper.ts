import { NewsStory } from '@prisma/client';
import {
  NewsStoryDetailResponseDto,
  NewsStoryResponseDto,
} from '../dto/news-story.dto';

export class NewsMapper {
  public static toResponseDto(story: NewsStory): NewsStoryResponseDto {
    return {
      id: story.id,
      title: story.title,
      summary: story.summary,
      url: story.url,
      readersCount: story.readersCount,
      createdAt: story.createdAt,
    };
  }

  public static toDetailResponseDto(
    story: NewsStory,
  ): NewsStoryDetailResponseDto {
    return {
      ...this.toResponseDto(story),
      body: story.body,
    };
  }
}
