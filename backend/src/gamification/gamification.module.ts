import { Module } from '@nestjs/common';
import { GamificationService } from './services/gamification.service';
import { GamificationController } from './controllers/gamification.controller';
import { GamificationRepository } from './repositories/gamification.repository';
import { ConnectionsModule } from '../connections/connections.module';
import { FollowsModule } from '../follows/follows.module';

@Module({
  imports: [ConnectionsModule, FollowsModule],
  controllers: [GamificationController],
  providers: [GamificationService, GamificationRepository],
})
export class GamificationModule {}
