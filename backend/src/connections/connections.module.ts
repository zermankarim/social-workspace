import { Module } from '@nestjs/common';
import { ConnectionsService } from './services/connections.service';
import { ConnectionsController } from './controllers/connections.controller';
import { ConnectionsRepository } from './repositories/connections.repository';

@Module({
  controllers: [ConnectionsController],
  providers: [ConnectionsService, ConnectionsRepository],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
