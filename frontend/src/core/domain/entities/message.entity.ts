import type { MessageAttachment } from "@/core/domain/entities/message-attachment.entity";
import type { MessageReaction } from "@/core/domain/entities/message-reaction.entity";
import type { MessageRecipientKey } from "@/core/domain/entities/message-recipient-key.entity";
import type { MessagingUser } from "@/core/domain/entities/messaging-user.entity";

export class Message {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly sender: MessagingUser,
    public readonly senderDeviceId: string | null,
    /** Legacy single-target payload — null on messages sent after the fan-out migration. */
    public readonly ciphertext: string | null,
    public readonly nonce: string | null,
    public readonly keyVersion: number,
    public readonly recipientKeys: MessageRecipientKey[],
    public readonly attachments: MessageAttachment[],
    public readonly createdAt: Date,
    public readonly editedAt: Date | null,
    public readonly deletedAt: Date | null,
    public readonly reactions: MessageReaction[] = [],
  ) {}

  isFrom(userId: string): boolean {
    return this.senderId === userId;
  }

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  myReaction(userId: string): MessageReaction | null {
    return (
      this.reactions.find((reaction) => reaction.userId === userId) ?? null
    );
  }

  recipientKeyFor(deviceId: string): MessageRecipientKey | null {
    return this.recipientKeys.find((key) => key.deviceId === deviceId) ?? null;
  }
}
