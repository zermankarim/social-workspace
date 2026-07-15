import { ConversationMember } from "@/core/domain/entities/conversation-member.entity";
import type { Message } from "@/core/domain/entities/message.entity";
import type { MessagingUser } from "@/core/domain/entities/messaging-user.entity";

export class Conversation {
  constructor(
    public readonly id: string,
    public readonly directKey: string,
    public readonly members: ConversationMember[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly unreadCount: number = 0,
    public readonly lastMessage: Message | null = null,
    public readonly peerOnline: boolean | undefined = undefined,
  ) {}

  peer(currentUserId: string): MessagingUser | null {
    const other = this.members.find(
      (member) => member.userId !== currentUserId,
    );
    return other?.user ?? null;
  }

  peerMember(currentUserId: string): ConversationMember | null {
    return (
      this.members.find((member) => member.userId !== currentUserId) ?? null
    );
  }

  ownMember(currentUserId: string): ConversationMember | null {
    return (
      this.members.find((member) => member.userId === currentUserId) ?? null
    );
  }

  withMemberLastRead(userId: string, lastReadAt: Date): Conversation {
    return new Conversation(
      this.id,
      this.directKey,
      this.members.map((member) =>
        member.userId === userId
          ? new ConversationMember(
              member.id,
              member.userId,
              member.user,
              member.joinedAt,
              lastReadAt,
            )
          : member,
      ),
      this.createdAt,
      this.updatedAt,
      this.unreadCount,
      this.lastMessage,
      this.peerOnline,
    );
  }

  withPeerOnline(peerOnline: boolean): Conversation {
    return new Conversation(
      this.id,
      this.directKey,
      this.members,
      this.createdAt,
      this.updatedAt,
      this.unreadCount,
      this.lastMessage,
      peerOnline,
    );
  }
}
