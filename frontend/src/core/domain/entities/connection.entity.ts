import type { ConnectionUser } from "@/core/domain/entities/connection-user.entity";
import type { ConnectionStatus } from "@/core/domain/enums/connection-status.enum";

export class Connection {
  constructor(
    public readonly id: string,
    public readonly status: ConnectionStatus,
    public readonly requester: ConnectionUser,
    public readonly addressee: ConnectionUser,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  involves(userId: string): boolean {
    return this.requester.id === userId || this.addressee.id === userId;
  }

  isRequester(userId: string): boolean {
    return this.requester.id === userId;
  }

  isAddressee(userId: string): boolean {
    return this.addressee.id === userId;
  }

  otherUser(currentUserId: string): ConnectionUser {
    return this.requester.id === currentUserId
      ? this.addressee
      : this.requester;
  }
}
