export interface MessagingUserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  avatarUrl: string | null;
}

export interface ConversationMemberResponseDto {
  id: string;
  userId: string;
  user: MessagingUserResponseDto;
  joinedAt: string;
  lastReadAt: string | null;
}

export interface ConversationResponseDto {
  id: string;
  directKey: string;
  members: ConversationMemberResponseDto[];
  unreadCount: number;
  lastMessage: MessageResponseDto | null;
  peerOnline?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UnreadTotalResponseDto {
  total: number;
}

export interface UserPresenceResponseDto {
  userId: string;
  online: boolean;
  lastSeenAt: string | null;
}

export interface PresenceListResponseDto {
  data: UserPresenceResponseDto[];
}

export interface PaginatedConversationsResponseDto {
  data: ConversationResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateDirectConversationRequestDto {
  peerUserId: string;
}

export interface MessageAttachmentResponseDto {
  id: string;
  url: string;
  ciphertextSize: number | null;
  createdAt: string;
}

export interface MessageReactionResponseDto {
  id: string;
  emoji: string;
  userId: string;
  createdAt: string;
}

export interface MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  sender: MessagingUserResponseDto;
  senderDeviceId: string | null;
  ciphertext: string;
  nonce: string;
  keyVersion: number;
  attachments: MessageAttachmentResponseDto[];
  reactions?: MessageReactionResponseDto[];
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
}

export interface PaginatedMessagesResponseDto {
  data: MessageResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SendMessageRequestDto {
  ciphertext: string;
  nonce: string;
  keyVersion?: number;
  senderDeviceId: string;
  attachments?: Array<{
    url: string;
    ciphertextSize?: number | null;
  }>;
}
