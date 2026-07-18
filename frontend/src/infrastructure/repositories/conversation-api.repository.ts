import type { Conversation } from "@/core/domain/entities/conversation.entity";
import type { Message } from "@/core/domain/entities/message.entity";
import type { PaginatedConversations } from "@/core/domain/entities/paginated-conversations.entity";
import type { PaginatedMessages } from "@/core/domain/entities/paginated-messages.entity";
import type { SendMessageInput } from "@/core/domain/entities/send-message-input.entity";
import type { UserPresence } from "@/core/domain/entities/user-presence.entity";
import { ConversationRepository } from "@/core/domain/repositories/conversation.repository";
import type {
  ConversationResponseDto,
  CreateDirectConversationRequestDto,
  MessageResponseDto,
  PaginatedConversationsResponseDto,
  PaginatedMessagesResponseDto,
  PresenceListResponseDto,
  SendMessageRequestDto,
  UnreadTotalResponseDto,
} from "@/infrastructure/api/dto/conversation-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ConversationMapper } from "@/infrastructure/mappers/conversation.mapper";
import { PaginatedConversationsMapper } from "@/infrastructure/mappers/paginated-conversations.mapper";
import { PaginatedMessagesMapper } from "@/infrastructure/mappers/paginated-messages.mapper";
import { PresenceMapper } from "@/infrastructure/mappers/presence.mapper";

export class ConversationApiRepository extends ConversationRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async openDirect(peerUserId: string): Promise<Conversation> {
    const body: CreateDirectConversationRequestDto = { peerUserId };
    const response = await this.httpClient.request<ConversationResponseDto>(
      "/conversations/direct",
      { method: "POST", body },
    );
    return ConversationMapper.fromApi(response);
  }

  async findMine(page = 1, limit = 20): Promise<PaginatedConversations> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response =
      await this.httpClient.request<PaginatedConversationsResponseDto>(
        `/conversations?${params.toString()}`,
      );
    return PaginatedConversationsMapper.fromApi(response);
  }

  async findById(id: string): Promise<Conversation> {
    const response = await this.httpClient.request<ConversationResponseDto>(
      `/conversations/${id}`,
    );
    return ConversationMapper.fromApi(response);
  }

  async getUnreadTotal(): Promise<number> {
    const response = await this.httpClient.request<UnreadTotalResponseDto>(
      "/conversations/unread-total",
    );
    return response.total;
  }

  async getPresence(userIds: string[]): Promise<UserPresence[]> {
    if (userIds.length === 0) return [];
    const params = new URLSearchParams({ userIds: userIds.join(",") });
    const response = await this.httpClient.request<PresenceListResponseDto>(
      `/conversations/presence?${params.toString()}`,
    );
    return response.data.map((item) => PresenceMapper.fromApi(item));
  }

  async markRead(id: string): Promise<void> {
    await this.httpClient.request<void>(`/conversations/${id}/read`, {
      method: "POST",
    });
  }

  async findMessages(
    conversationId: string,
    page = 1,
    limit = 30,
  ): Promise<PaginatedMessages> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response =
      await this.httpClient.request<PaginatedMessagesResponseDto>(
        `/conversations/${conversationId}/messages?${params.toString()}`,
      );
    return PaginatedMessagesMapper.fromApi(response);
  }

  async sendMessage(
    conversationId: string,
    input: SendMessageInput,
  ): Promise<Message> {
    const body: SendMessageRequestDto = {
      ciphertext: input.ciphertext,
      nonce: input.nonce,
      senderDeviceId: input.senderDeviceId,
      keyVersion: input.keyVersion,
      attachments: input.attachments,
    };
    const response = await this.httpClient.request<MessageResponseDto>(
      `/conversations/${conversationId}/messages`,
      { method: "POST", body },
    );
    return ConversationMapper.messageFromApi(response);
  }

  async setReaction(
    conversationId: string,
    messageId: string,
    emoji: string,
  ): Promise<Message> {
    const response = await this.httpClient.request<MessageResponseDto>(
      `/conversations/${conversationId}/messages/${messageId}/reaction`,
      { method: "PUT", body: { emoji } },
    );
    return ConversationMapper.messageFromApi(response);
  }

  async removeReaction(
    conversationId: string,
    messageId: string,
  ): Promise<Message> {
    const response = await this.httpClient.request<MessageResponseDto>(
      `/conversations/${conversationId}/messages/${messageId}/reaction`,
      { method: "DELETE" },
    );
    return ConversationMapper.messageFromApi(response);
  }
}
