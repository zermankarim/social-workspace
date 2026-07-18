import { Module } from '@nestjs/common';
import { HashtagsService } from './services/hashtags.service';
import { HashtagsController } from './controllers/hashtags.controller';
import { HashtagsRepository } from './repositories/hashtags.repository';

@Module({
  controllers: [HashtagsController],
  providers: [HashtagsService, HashtagsRepository],
  exports: [HashtagsService],
})
export class HashtagsModule {}
