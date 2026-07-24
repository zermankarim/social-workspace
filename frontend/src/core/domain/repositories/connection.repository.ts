import type { Connection } from "@/core/domain/entities/connection.entity";
import type { PaginatedConnections } from "@/core/domain/entities/paginated-connections.entity";

export abstract class ConnectionRepository {
  abstract create(addresseeId: string): Promise<Connection>;
  abstract findAccepted(
    page?: number,
    limit?: number,
  ): Promise<PaginatedConnections>;
  abstract findPendingIncoming(
    page?: number,
    limit?: number,
  ): Promise<PaginatedConnections>;
  abstract findPendingOutgoing(
    page?: number,
    limit?: number,
  ): Promise<PaginatedConnections>;
  abstract findAcceptedByUserId(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedConnections>;
  abstract accept(id: string): Promise<Connection>;
  abstract reject(id: string): Promise<Connection>;
  abstract remove(id: string): Promise<void>;
  abstract block(userId: string): Promise<Connection>;
  abstract unblock(userId: string): Promise<void>;
}
