import { Module } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './controllers/comments.controller';
import { PostCommentsController } from './controllers/post-comments.controller';
import { CommentsRepository } from './repositories/comments.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [PostCommentsController, CommentsController],
  providers: [CommentsService, CommentsRepository],
})
export class CommentsModule {}
