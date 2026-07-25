import type { Connection } from "@/core/domain/entities/connection.entity";
import type { ConnectionSuggestion } from "@/core/domain/entities/connection-suggestion.entity";
import type { PaginatedConnections } from "@/core/domain/entities/paginated-connections.entity";
import type { ConnectionRepository } from "@/core/domain/repositories/connection.repository";

export class ConnectionService {
  constructor(private readonly connectionRepository: ConnectionRepository) {}

  create(addresseeId: string): Promise<Connection> {
    return this.connectionRepository.create(addresseeId);
  }

  getAccepted(page = 1, limit = 20): Promise<PaginatedConnections> {
    return this.connectionRepository.findAccepted(page, limit);
  }

  getPendingIncoming(page = 1, limit = 20): Promise<PaginatedConnections> {
    return this.connectionRepository.findPendingIncoming(page, limit);
  }

  getPendingOutgoing(page = 1, limit = 20): Promise<PaginatedConnections> {
    return this.connectionRepository.findPendingOutgoing(page, limit);
  }

  getAcceptedByUserId(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedConnections> {
    return this.connectionRepository.findAcceptedByUserId(userId, page, limit);
  }

  accept(id: string): Promise<Connection> {
    return this.connectionRepository.accept(id);
  }

  reject(id: string): Promise<Connection> {
    return this.connectionRepository.reject(id);
  }

  remove(id: string): Promise<void> {
    return this.connectionRepository.remove(id);
  }

  block(userId: string): Promise<Connection> {
    return this.connectionRepository.block(userId);
  }

  unblock(userId: string): Promise<void> {
    return this.connectionRepository.unblock(userId);
  }

  getSuggestions(limit = 10): Promise<ConnectionSuggestion[]> {
    return this.connectionRepository.getSuggestions(limit);
  }
}
