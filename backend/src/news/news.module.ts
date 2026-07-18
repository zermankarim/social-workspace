import { Module } from '@nestjs/common';
import { NewsController } from './controllers/news.controller';
import { NewsService } from './services/news.service';
import { NewsRepository } from './repositories/news.repository';

@Module({
  controllers: [NewsController],
  providers: [NewsService, NewsRepository],
})
export class NewsModule {}
