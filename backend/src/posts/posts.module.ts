import { Module } from '@nestjs/common';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { PostsRepository } from './repositories/posts.repository';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [HashtagsModule, NotificationsModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
