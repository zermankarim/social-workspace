import { Module } from '@nestjs/common';
import { LikesService } from './services/likes.service';
import { LikesController } from './controllers/likes.controller';
import { LikesRepository } from './repositories/likes.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}
