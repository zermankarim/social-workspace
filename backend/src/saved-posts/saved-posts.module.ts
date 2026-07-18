import { Module } from '@nestjs/common';
import { SavedPostsService } from './services/saved-posts.service';
import { SavedPostsController } from './controllers/saved-posts.controller';
import { SavedPostsRepository } from './repositories/saved-posts.repository';

@Module({
  controllers: [SavedPostsController],
  providers: [SavedPostsService, SavedPostsRepository],
})
export class SavedPostsModule {}
