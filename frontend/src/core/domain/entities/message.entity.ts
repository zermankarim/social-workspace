import type { MessageAttachment } from "@/core/domain/entities/message-attachment.entity";
import type { MessagingUser } from "@/core/domain/entities/messaging-user.entity";

export class Message {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly sender: MessagingUser,
    public readonly senderDeviceId: string | null,
    public readonly ciphertext: string,
    public readonly nonce: string,
    public readonly keyVersion: number,
    public readonly attachments: MessageAttachment[],
    public readonly createdAt: Date,
    public readonly editedAt: Date | null,
    public readonly deletedAt: Date | null,
  ) {}

  isFrom(userId: string): boolean {
    return this.senderId === userId;
  }

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
