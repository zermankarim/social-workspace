import { Module } from '@nestjs/common';
import { ConversationsController } from './controllers/conversations.controller';
import { ConversationsService } from './services/conversations.service';
import { ConversationsRepository } from './repositories/conversations.repository';
import { PresenceService } from './services/presence.service';
import { ConnectionsModule } from '../connections/connections.module';
import { MessagingGateway } from './gateway/messaging.gateway';
import { AuthModule } from '../auth/auth.module';
import { AppConfigModule } from '../infrastructure/config/config.module';

@Module({
  imports: [ConnectionsModule, AuthModule, AppConfigModule],
  controllers: [ConversationsController],
  providers: [
    ConversationsService,
    ConversationsRepository,
    PresenceService,
    MessagingGateway,
  ],
  exports: [ConversationsService, MessagingGateway, PresenceService],
})
export class ConversationsModule {}
