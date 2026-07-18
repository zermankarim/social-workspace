import { Module } from '@nestjs/common';
import { ProfileViewsController } from './controllers/profile-views.controller';
import { ProfileViewsService } from './services/profile-views.service';
import { ProfileViewsRepository } from './repositories/profile-views.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ProfileViewsController],
  providers: [ProfileViewsService, ProfileViewsRepository],
})
export class ProfileViewsModule {}
