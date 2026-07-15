import type { Conversation } from "@/core/domain/entities/conversation.entity";
import type { Message } from "@/core/domain/entities/message.entity";
import type { PaginatedConversations } from "@/core/domain/entities/paginated-conversations.entity";
import type { PaginatedMessages } from "@/core/domain/entities/paginated-messages.entity";
import type { SendMessageInput } from "@/core/domain/entities/send-message-input.entity";
import type { UserPresence } from "@/core/domain/entities/user-presence.entity";
import type { ConversationRepository } from "@/core/domain/repositories/conversation.repository";

export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  openDirect(peerUserId: string): Promise<Conversation> {
    return this.conversationRepository.openDirect(peerUserId);
  }

  getMine(page = 1, limit = 20): Promise<PaginatedConversations> {
    return this.conversationRepository.findMine(page, limit);
  }

  getById(id: string): Promise<Conversation> {
    return this.conversationRepository.findById(id);
  }

  getUnreadTotal(): Promise<number> {
    return this.conversationRepository.getUnreadTotal();
  }

  getPresence(userIds: string[]): Promise<UserPresence[]> {
    return this.conversationRepository.getPresence(userIds);
  }

  markRead(id: string): Promise<void> {
    return this.conversationRepository.markRead(id);
  }

  getMessages(
    conversationId: string,
    page = 1,
    limit = 30,
  ): Promise<PaginatedMessages> {
    return this.conversationRepository.findMessages(
      conversationId,
      page,
      limit,
    );
  }

  sendMessage(
    conversationId: string,
    input: SendMessageInput,
  ): Promise<Message> {
    return this.conversationRepository.sendMessage(conversationId, input);
  }
}
