import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Inject, UsePipes, ValidationPipe, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConversationsService } from '../services/conversations.service';
import { PresenceService } from '../services/presence.service';
import { ConnectionsService } from '../../connections/services/connections.service';
import { MessageResponseDto } from '../dto/message.dto';
import { AppConfigService } from '../../infrastructure/config/services/config.service';
import { getAccessTokenFromHandshake } from './ws-auth.util';
import { JwtPayload } from '../../auth/types/jwt-payload';
import type {
  MessagingServer,
  MessagingSocket,
} from './messaging-socket.types';
import { ConversationRoomDto } from '../dto/conversation-room.dto';
import { UserPresenceDto } from '../dto/user-presence.dto';

@WebSocketGateway({
  namespace: '/ws',
})
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: true,
  }),
)
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: MessagingServer;

  constructor(
    @Inject(forwardRef(() => ConversationsService))
    private readonly conversationsService: ConversationsService,
    private readonly presenceService: PresenceService,
    private readonly connectionsService: ConnectionsService,
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfigService,
  ) {}

  async handleConnection(client: MessagingSocket) {
    try {
      const accessToken = getAccessTokenFromHandshake(
        client.handshake.headers.cookie,
      );

      if (!accessToken) {
        client.disconnect();
        return;
      }

      const decoded = await this.jwtService.verifyAsync<JwtPayload>(
        accessToken,
        {
          secret: this.appConfig.auth.jwtSecret,
        },
      );

      if (!decoded?.userId) {
        client.disconnect();
        return;
      }

      client.data.userId = decoded.userId;
      await client.join(this.userRoom(decoded.userId));

      const cameOnline = this.presenceService.trackConnect(decoded.userId);
      if (cameOnline) {
        await this.broadcastPresence(decoded.userId, true);
      }
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: MessagingSocket) {
    const userId = client.data.userId;
    if (!userId) {
      return;
    }

    const wentOffline = this.presenceService.trackDisconnect(userId);
    if (wentOffline) {
      await this.broadcastPresence(userId, false);
    }
  }

  @SubscribeMessage('conversation:join')
  async join(
    @ConnectedSocket() client: MessagingSocket,
    @MessageBody() body: ConversationRoomDto,
  ) {
    const userId = this.requireUserId(client);
    try {
      await this.conversationsService.assertMember(userId, body.conversationId);
    } catch {
      throw new WsException('Forbidden or conversation not found');
    }
    await client.join(this.conversationRoom(body.conversationId));
    return { ok: true };
  }

  @SubscribeMessage('conversation:leave')
  async leave(
    @ConnectedSocket() client: MessagingSocket,
    @MessageBody() body: ConversationRoomDto,
  ) {
    this.requireUserId(client);
    await client.leave(this.conversationRoom(body.conversationId));
    return { ok: true };
  }

  /**
   * Live chat room + personal rooms so recipients get toast/badge updates
   * without joining the conversation.
   */
  emitMessageCreated(
    conversationId: string,
    message: MessageResponseDto,
    recipientUserIds: string[],
  ) {
    this.server
      .to(this.conversationRoom(conversationId))
      .emit('message:created', message);

    for (const userId of recipientUserIds) {
      this.server.to(this.userRoom(userId)).emit('message:created', message);
    }
  }

  emitConversationRead(
    conversationId: string,
    payload: {
      conversationId: string;
      userId: string;
      lastReadAt: string;
    },
    peerUserIds: string[],
  ) {
    this.server
      .to(this.conversationRoom(conversationId))
      .emit('conversation:read', payload);

    for (const userId of peerUserIds) {
      this.server.to(this.userRoom(userId)).emit('conversation:read', payload);
    }
  }

  private async broadcastPresence(userId: string, online: boolean) {
    const presence: UserPresenceDto = this.presenceService.getPresence(userId);
    // Ensure payload matches actual transition (lastSeenAt set on offline)
    const payload: UserPresenceDto = online
      ? { userId, online: true, lastSeenAt: null }
      : presence;

    const peerIds =
      await this.connectionsService.findAcceptedPeerUserIds(userId);

    for (const peerId of peerIds) {
      this.server.to(this.userRoom(peerId)).emit('user:presence', payload);
    }
  }

  private requireUserId(client: MessagingSocket): string {
    const userId = client.data.userId;
    if (!userId) {
      throw new WsException('Unauthorized');
    }
    return userId;
  }

  private conversationRoom(conversationId: string) {
    return `conversation:${conversationId}`;
  }

  private userRoom(userId: string) {
    return `user:${userId}`;
  }
}
