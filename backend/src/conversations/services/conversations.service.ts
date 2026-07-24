import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConversationsRepository } from '../repositories/conversations.repository';
import { ConnectionsService } from '../../connections/services/connections.service';
import { CreateDirectConversationDto } from '../dto/create-direct-conversation.dto';
import {
  ConversationResponseDto,
  UnreadTotalResponseDto,
} from '../dto/conversation.dto';
import { MessageResponseDto, SendMessageDto } from '../dto/message.dto';
import { PaginatedConversationsQueryDto } from '../dto/paginated-conversations-query.dto';
import { PaginatedMessagesQueryDto } from '../dto/paginated-messages-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { ConversationsMapper } from '../mappers/conversations.mapper';
import { buildDirectKey } from '../utils/direct-key.utils';
import { MessagingGateway } from '../gateway/messaging.gateway';
import { PresenceService } from './presence.service';
import { UserPresenceDto } from '../dto/user-presence.dto';
import {
  ConversationListSelected,
  ConversationSelected,
  MessageSelected,
} from '../conversations.select';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    private readonly connectionsService: ConnectionsService,
    private readonly presenceService: PresenceService,
    @Inject(forwardRef(() => MessagingGateway))
    private readonly messagingGateway: MessagingGateway,
  ) {}

  async openDirect(
    userId: string,
    dto: CreateDirectConversationDto,
  ): Promise<ConversationResponseDto> {
    if (userId === dto.peerUserId) {
      throw new ForbiddenException('Cannot open a conversation with yourself');
    }

    const connected = await this.connectionsService.areAcceptedConnected(
      userId,
      dto.peerUserId,
    );
    if (!connected) {
      throw new ForbiddenException('You can only message accepted connections');
    }

    const directKey = buildDirectKey(userId, dto.peerUserId);
    const existing =
      await this.conversationsRepository.findByDirectKeyForList(directKey);
    if (existing) {
      return this.toEnrichedConversation(userId, existing);
    }

    try {
      await this.conversationsRepository.createDirect(
        directKey,
        userId,
        dto.peerUserId,
      );
      const created =
        await this.conversationsRepository.findByDirectKeyForList(directKey);
      if (!created) {
        throw new NotFoundException('Conversation not found after create');
      }
      return this.toEnrichedConversation(userId, created);
    } catch (error) {
      // Concurrent openDirect from both users
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const raced =
          await this.conversationsRepository.findByDirectKeyForList(directKey);
        if (raced) {
          return this.toEnrichedConversation(userId, raced);
        }
      }
      throw error;
    }
  }

  async listMine(
    userId: string,
    query: PaginatedConversationsQueryDto,
  ): Promise<PaginatedResponseDto<ConversationResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [items, total] = await Promise.all([
      this.conversationsRepository.findManyForUser(userId, skip, take),
      this.conversationsRepository.countForUser(userId),
    ]);

    const unreadById =
      await this.conversationsRepository.countUnreadByConversationIds(
        userId,
        items.map((item) => item.id),
      );

    return {
      data: items.map((item) => {
        const peerId = ConversationsMapper.peerUserId(item, userId);
        return ConversationsMapper.toConversationResponse(item, {
          unreadCount: unreadById.get(item.id) ?? 0,
          peerOnline: peerId
            ? this.presenceService.isOnline(peerId)
            : undefined,
        });
      }),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getById(
    userId: string,
    conversationId: string,
  ): Promise<ConversationResponseDto> {
    const conversation = await this.getMembershipOrThrow(
      userId,
      conversationId,
    );
    const withLast =
      await this.conversationsRepository.findByIdForList(conversationId);
    return this.toEnrichedConversation(userId, withLast ?? conversation);
  }

  async getUnreadTotal(userId: string): Promise<UnreadTotalResponseDto> {
    const total = await this.conversationsRepository.countUnreadTotal(userId);
    return { total };
  }

  getPresence(userIds: string[]): UserPresenceDto[] {
    return this.presenceService.getPresenceMany(userIds);
  }

  async markRead(userId: string, conversationId: string): Promise<void> {
    const conversation = await this.getMembershipOrThrow(
      userId,
      conversationId,
    );
    const lastReadAt = new Date();
    await this.conversationsRepository.markRead(
      conversationId,
      userId,
      lastReadAt,
    );

    const recipientUserIds = conversation.members
      .map((member) => member.userId)
      .filter((id) => id !== userId);

    this.messagingGateway.emitConversationRead(
      conversationId,
      {
        conversationId,
        userId,
        lastReadAt: lastReadAt.toISOString(),
      },
      recipientUserIds,
    );
  }

  async listMessages(
    userId: string,
    conversationId: string,
    query: PaginatedMessagesQueryDto,
  ): Promise<PaginatedResponseDto<MessageResponseDto>> {
    await this.getMembershipOrThrow(userId, conversationId);

    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [items, total] = await Promise.all([
      this.conversationsRepository.findMessages(conversationId, skip, take),
      this.conversationsRepository.countMessages(conversationId),
    ]);

    return {
      data: items.map((item) => ConversationsMapper.toMessageResponse(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    dto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    const conversation = await this.getMembershipOrThrow(
      userId,
      conversationId,
    );

    const device = await this.conversationsRepository.findDeviceForUser(
      dto.senderDeviceId,
      userId,
    );
    if (!device) {
      throw new ForbiddenException('Sender device not found for this user');
    }

    // Defense in depth: a client must only fan out ciphertext to devices that
    // actually belong to this conversation's members (itself or the peer).
    const memberUserIds = conversation.members.map((member) => member.userId);
    const validDeviceIds =
      await this.conversationsRepository.findDeviceIdsForUsers(memberUserIds);
    const targetsOutsideConversation = dto.recipientKeys.some(
      (key) => !validDeviceIds.has(key.deviceId),
    );
    if (targetsOutsideConversation) {
      throw new BadRequestException(
        'recipientKeys must only target devices belonging to conversation members',
      );
    }

    const created = await this.conversationsRepository.createMessageAndTouch(
      conversationId,
      {
        conversation: { connect: { id: conversationId } },
        sender: { connect: { id: userId } },
        senderDevice: { connect: { id: dto.senderDeviceId } },
        recipientKeys: {
          create: dto.recipientKeys.map((key) => ({
            device: { connect: { id: key.deviceId } },
            ciphertext: key.ciphertext,
            nonce: key.nonce,
            keyVersion: key.keyVersion ?? 1,
          })),
        },
        attachments: dto.attachments?.length
          ? {
              create: dto.attachments.map((attachment) => ({
                url: attachment.url,
                ciphertextSize: attachment.ciphertextSize ?? null,
              })),
            }
          : undefined,
      },
    );

    const response = ConversationsMapper.toMessageResponse(created);
    const recipientUserIds = conversation.members
      .map((member) => member.userId)
      .filter((id) => id !== userId);

    this.messagingGateway.emitMessageCreated(
      conversationId,
      response,
      recipientUserIds,
    );
    return response;
  }

  async setReaction(
    userId: string,
    conversationId: string,
    messageId: string,
    emoji: string,
  ): Promise<MessageResponseDto> {
    const conversation = await this.getMembershipOrThrow(
      userId,
      conversationId,
    );
    await this.assertMessageInConversation(messageId, conversationId);

    const updated = await this.conversationsRepository.setReaction(
      messageId,
      userId,
      emoji,
    );
    return this.broadcastMessageUpdate(conversation, userId, updated);
  }

  async removeReaction(
    userId: string,
    conversationId: string,
    messageId: string,
  ): Promise<MessageResponseDto> {
    const conversation = await this.getMembershipOrThrow(
      userId,
      conversationId,
    );
    await this.assertMessageInConversation(messageId, conversationId);

    const updated = await this.conversationsRepository.removeReaction(
      messageId,
      userId,
    );
    return this.broadcastMessageUpdate(conversation, userId, updated);
  }

  private async assertMessageInConversation(
    messageId: string,
    conversationId: string,
  ): Promise<void> {
    const message =
      await this.conversationsRepository.findMessageById(messageId);
    if (!message || message.conversationId !== conversationId) {
      throw new NotFoundException('Message not found in this conversation');
    }
    if (message.deletedAt != null) {
      throw new BadRequestException('Cannot react to a deleted message');
    }
  }

  private broadcastMessageUpdate(
    conversation: ConversationSelected,
    userId: string,
    message: MessageSelected,
  ): MessageResponseDto {
    const response = ConversationsMapper.toMessageResponse(message);
    const recipientUserIds = conversation.members
      .map((member) => member.userId)
      .filter((id) => id !== userId);

    this.messagingGateway.emitMessageUpdated(
      conversation.id,
      response,
      recipientUserIds,
    );
    return response;
  }

  async assertMember(userId: string, conversationId: string): Promise<void> {
    await this.getMembershipOrThrow(userId, conversationId);
  }

  private async toEnrichedConversation(
    userId: string,
    conversation: ConversationSelected | ConversationListSelected,
  ): Promise<ConversationResponseDto> {
    const unreadCount =
      await this.conversationsRepository.countUnreadForConversation(
        conversation.id,
        userId,
      );
    const peerId = ConversationsMapper.peerUserId(conversation, userId);

    return ConversationsMapper.toConversationResponse(conversation, {
      unreadCount,
      peerOnline: peerId ? this.presenceService.isOnline(peerId) : undefined,
    });
  }

  private async getMembershipOrThrow(userId: string, conversationId: string) {
    const conversation =
      await this.conversationsRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    const isMember = conversation.members.some(
      (member) => member.userId === userId,
    );
    if (!isMember) {
      throw new ForbiddenException('Not a member of this conversation');
    }
    return conversation;
  }
}
