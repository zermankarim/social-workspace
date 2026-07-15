import {
  ConversationResponseDto,
  ConversationMemberDto,
} from '../dto/conversation.dto';
import {
  MessageAttachmentResponseDto,
  MessageResponseDto,
} from '../dto/message.dto';
import { MessagingUserDto } from '../dto/messaging-user.dto';
import {
  ConversationListSelected,
  ConversationMemberSelected,
  ConversationSelected,
  MessageAttachmentSelected,
  MessageSelected,
  MessagingUserSelected,
} from '../conversations.select';

export type ConversationMapOptions = {
  unreadCount: number;
  lastMessage?: MessageSelected | null;
  peerOnline?: boolean;
};

export class ConversationsMapper {
  static toMessagingUser(user: MessagingUserSelected): MessagingUserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline,
      avatarUrl: user.avatarUrl,
    };
  }

  static toMember(member: ConversationMemberSelected): ConversationMemberDto {
    return {
      id: member.id,
      userId: member.userId,
      user: this.toMessagingUser(member.user),
      joinedAt: member.joinedAt,
      lastReadAt: member.lastReadAt,
    };
  }

  static toConversationResponse(
    conversation: ConversationSelected | ConversationListSelected,
    options: ConversationMapOptions,
  ): ConversationResponseDto {
    const lastFromList =
      'messages' in conversation ? (conversation.messages[0] ?? null) : null;
    const lastMessageEntity =
      options.lastMessage !== undefined ? options.lastMessage : lastFromList;

    return {
      id: conversation.id,
      directKey: conversation.directKey,
      members: conversation.members.map((member) => this.toMember(member)),
      unreadCount: options.unreadCount,
      lastMessage: lastMessageEntity
        ? this.toMessageResponse(lastMessageEntity)
        : null,
      peerOnline: options.peerOnline,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  static toAttachment(
    attachment: MessageAttachmentSelected,
  ): MessageAttachmentResponseDto {
    return {
      id: attachment.id,
      url: attachment.url,
      ciphertextSize: attachment.ciphertextSize,
      createdAt: attachment.createdAt,
    };
  }

  static toMessageResponse(message: MessageSelected): MessageResponseDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      sender: this.toMessagingUser(message.sender),
      senderDeviceId: message.senderDeviceId,
      ciphertext: message.ciphertext,
      nonce: message.nonce,
      keyVersion: message.keyVersion,
      attachments: message.attachments.map((item) => this.toAttachment(item)),
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      deletedAt: message.deletedAt,
    };
  }

  static peerUserId(
    conversation: ConversationSelected | ConversationListSelected,
    viewerId: string,
  ): string | null {
    const peer = conversation.members.find(
      (member) => member.userId !== viewerId,
    );
    return peer?.userId ?? null;
  }
}
