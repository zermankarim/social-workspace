import { Module } from '@nestjs/common';
import { GamificationService } from './services/gamification.service';
import { GamificationController } from './controllers/gamification.controller';
import { GamificationRepository } from './repositories/gamification.repository';
import { GamificationListener } from './listeners/gamification.listener';
import { ConnectionsModule } from '../connections/connections.module';
import { FollowsModule } from '../follows/follows.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ConnectionsModule, FollowsModule, NotificationsModule],
  controllers: [GamificationController],
  providers: [
    GamificationService,
    GamificationRepository,
    GamificationListener,
  ],
})
export class GamificationModule {}
