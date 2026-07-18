import { Prisma } from '@prisma/client';

export const messagingUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  headline: true,
  avatarUrl: true,
} as const satisfies Prisma.UserSelect;

export type MessagingUserSelected = Prisma.UserGetPayload<{
  select: typeof messagingUserSelect;
}>;

export const messageAttachmentSelect = {
  id: true,
  url: true,
  ciphertextSize: true,
  createdAt: true,
} as const satisfies Prisma.MessageAttachmentSelect;

export type MessageAttachmentSelected = Prisma.MessageAttachmentGetPayload<{
  select: typeof messageAttachmentSelect;
}>;

export const userDeviceSelect = {
  id: true,
  userId: true,
  deviceId: true,
  identityKeyPub: true,
  signedPreKeyPub: true,
  signedPreKeyId: true,
  createdAt: true,
  lastSeenAt: true,
} as const satisfies Prisma.UserDeviceSelect;

export type UserDeviceSelected = Prisma.UserDeviceGetPayload<{
  select: typeof userDeviceSelect;
}>;

export const conversationMemberSelect = {
  id: true,
  userId: true,
  joinedAt: true,
  lastReadAt: true,
  user: { select: messagingUserSelect },
} as const satisfies Prisma.ConversationMemberSelect;

export type ConversationMemberSelected = Prisma.ConversationMemberGetPayload<{
  select: typeof conversationMemberSelect;
}>;

export const conversationSelect = {
  id: true,
  directKey: true,
  createdAt: true,
  updatedAt: true,
  members: {
    select: conversationMemberSelect,
    orderBy: { joinedAt: 'asc' as const },
  },
} as const satisfies Prisma.ConversationSelect;

export type ConversationSelected = Prisma.ConversationGetPayload<{
  select: typeof conversationSelect;
}>;

export const messageReactionSelect = {
  id: true,
  emoji: true,
  userId: true,
  createdAt: true,
} as const satisfies Prisma.MessageReactionSelect;

export type MessageReactionSelected = Prisma.MessageReactionGetPayload<{
  select: typeof messageReactionSelect;
}>;

export const messageSelect = {
  id: true,
  conversationId: true,
  senderId: true,
  senderDeviceId: true,
  ciphertext: true,
  nonce: true,
  keyVersion: true,
  createdAt: true,
  editedAt: true,
  deletedAt: true,
  sender: { select: messagingUserSelect },
  attachments: {
    select: messageAttachmentSelect,
    orderBy: { createdAt: 'asc' as const },
  },
  reactions: {
    select: messageReactionSelect,
    orderBy: { createdAt: 'asc' as const },
  },
} as const satisfies Prisma.MessageSelect;

export type MessageSelected = Prisma.MessageGetPayload<{
  select: typeof messageSelect;
}>;

export const conversationListSelect = {
  ...conversationSelect,
  messages: {
    where: { deletedAt: null },
    take: 1,
    orderBy: { createdAt: 'desc' as const },
    select: messageSelect,
  },
} as const satisfies Prisma.ConversationSelect;

export type ConversationListSelected = Prisma.ConversationGetPayload<{
  select: typeof conversationListSelect;
}>;
