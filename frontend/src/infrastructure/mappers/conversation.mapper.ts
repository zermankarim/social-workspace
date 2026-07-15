import { ConversationMember } from "@/core/domain/entities/conversation-member.entity";
import { Conversation } from "@/core/domain/entities/conversation.entity";
import { MessageAttachment } from "@/core/domain/entities/message-attachment.entity";
import { Message } from "@/core/domain/entities/message.entity";
import { MessagingUser } from "@/core/domain/entities/messaging-user.entity";
import type {
  ConversationMemberResponseDto,
  ConversationResponseDto,
  MessageAttachmentResponseDto,
  MessageResponseDto,
  MessagingUserResponseDto,
} from "@/infrastructure/api/dto/conversation-response.dto";

export class ConversationMapper {
  static userFromApi(dto: MessagingUserResponseDto): MessagingUser {
    return new MessagingUser(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.headline,
      dto.avatarUrl,
    );
  }

  static memberFromApi(dto: ConversationMemberResponseDto): ConversationMember {
    return new ConversationMember(
      dto.id,
      dto.userId,
      this.userFromApi(dto.user),
      new Date(dto.joinedAt),
      dto.lastReadAt ? new Date(dto.lastReadAt) : null,
    );
  }

  static fromApi(dto: ConversationResponseDto): Conversation {
    return new Conversation(
      dto.id,
      dto.directKey,
      dto.members.map((member) => this.memberFromApi(member)),
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
      dto.unreadCount ?? 0,
      dto.lastMessage ? this.messageFromApi(dto.lastMessage) : null,
      dto.peerOnline,
    );
  }

  static attachmentFromApi(
    dto: MessageAttachmentResponseDto,
  ): MessageAttachment {
    return new MessageAttachment(
      dto.id,
      dto.url,
      dto.ciphertextSize,
      new Date(dto.createdAt),
    );
  }

  static messageFromApi(dto: MessageResponseDto): Message {
    return new Message(
      dto.id,
      dto.conversationId,
      dto.senderId,
      this.userFromApi(dto.sender),
      dto.senderDeviceId,
      dto.ciphertext,
      dto.nonce,
      dto.keyVersion,
      dto.attachments.map((attachment) => this.attachmentFromApi(attachment)),
      new Date(dto.createdAt),
      dto.editedAt ? new Date(dto.editedAt) : null,
      dto.deletedAt ? new Date(dto.deletedAt) : null,
    );
  }
}
