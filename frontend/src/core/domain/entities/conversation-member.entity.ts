import type { MessagingUser } from "@/core/domain/entities/messaging-user.entity";

export class ConversationMember {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly user: MessagingUser,
    public readonly joinedAt: Date,
    public readonly lastReadAt: Date | null,
  ) {}
}
