import { Module } from '@nestjs/common';
import { ConnectionsService } from './services/connections.service';
import { ConnectionsController } from './controllers/connections.controller';
import { ConnectionsRepository } from './repositories/connections.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService, ConnectionsRepository],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
