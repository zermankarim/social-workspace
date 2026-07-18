import type { Conversation } from "@/core/domain/entities/conversation.entity";
import type { Message } from "@/core/domain/entities/message.entity";
import type { PaginatedConversations } from "@/core/domain/entities/paginated-conversations.entity";
import type { PaginatedMessages } from "@/core/domain/entities/paginated-messages.entity";
import type { SendMessageInput } from "@/core/domain/entities/send-message-input.entity";
import type { UserPresence } from "@/core/domain/entities/user-presence.entity";

export abstract class ConversationRepository {
  abstract openDirect(peerUserId: string): Promise<Conversation>;
  abstract findMine(
    page?: number,
    limit?: number,
  ): Promise<PaginatedConversations>;
  abstract findById(id: string): Promise<Conversation>;
  abstract getUnreadTotal(): Promise<number>;
  abstract getPresence(userIds: string[]): Promise<UserPresence[]>;
  abstract markRead(id: string): Promise<void>;
  abstract findMessages(
    conversationId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedMessages>;
  abstract sendMessage(
    conversationId: string,
    input: SendMessageInput,
  ): Promise<Message>;
  abstract setReaction(
    conversationId: string,
    messageId: string,
    emoji: string,
  ): Promise<Message>;
  abstract removeReaction(
    conversationId: string,
    messageId: string,
  ): Promise<Message>;
}
