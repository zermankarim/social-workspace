import { Injectable, NotFoundException } from '@nestjs/common';
import { NewsRepository } from '../repositories/news.repository';
import { NewsMapper } from '../mappers/news.mapper';
import {
  NewsStoryDetailResponseDto,
  NewsStoryResponseDto,
} from '../dto/news-story.dto';
import { CreateNewsStoryDto } from '../dto/create-news-story.dto';

const DEFAULT_NEWS_LIMIT = 6;
const MAX_NEWS_LIMIT = 20;

@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  async list(limit?: number): Promise<NewsStoryResponseDto[]> {
    const take = Math.min(
      Math.max(limit ?? DEFAULT_NEWS_LIMIT, 1),
      MAX_NEWS_LIMIT,
    );
    const stories = await this.newsRepository.findLatest(take);
    return stories.map((story) => NewsMapper.toResponseDto(story));
  }

  async getById(id: string): Promise<NewsStoryDetailResponseDto> {
    const story = await this.newsRepository.findById(id);
    if (!story) {
      throw new NotFoundException('News story not found');
    }
    return NewsMapper.toDetailResponseDto(story);
  }

  async create(dto: CreateNewsStoryDto): Promise<NewsStoryDetailResponseDto> {
    const story = await this.newsRepository.create({
      title: dto.title.trim(),
      summary: dto.summary?.trim() || null,
      body: dto.body?.trim() || null,
      url: dto.url?.trim() || null,
    });
    return NewsMapper.toDetailResponseDto(story);
  }

  async registerRead(
    id: string,
    userId: string,
  ): Promise<NewsStoryResponseDto> {
    const existing = await this.newsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('News story not found');
    }
    const updated = await this.newsRepository.registerRead(id, userId);
    if (!updated) {
      throw new NotFoundException('News story not found');
    }
    return NewsMapper.toResponseDto(updated);
  }
}
