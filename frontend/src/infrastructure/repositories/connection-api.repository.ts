import type { Connection } from "@/core/domain/entities/connection.entity";
import type { PaginatedConnections } from "@/core/domain/entities/paginated-connections.entity";
import { ConnectionRepository } from "@/core/domain/repositories/connection.repository";
import type {
  ConnectionResponseDto,
  CreateConnectionRequestDto,
  PaginatedConnectionsResponseDto,
} from "@/infrastructure/api/dto/connection-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ConnectionMapper } from "@/infrastructure/mappers/connection.mapper";
import { PaginatedConnectionsMapper } from "@/infrastructure/mappers/paginated-connections.mapper";

export class ConnectionApiRepository extends ConnectionRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async create(addresseeId: string): Promise<Connection> {
    const body: CreateConnectionRequestDto = { addresseeId };
    const response = await this.httpClient.request<ConnectionResponseDto>(
      "/connections",
      { method: "POST", body },
    );
    return ConnectionMapper.fromApi(response);
  }

  async findAccepted(page = 1, limit = 20): Promise<PaginatedConnections> {
    return this.fetchList("/connections", page, limit);
  }

  async findPendingIncoming(
    page = 1,
    limit = 20,
  ): Promise<PaginatedConnections> {
    return this.fetchList("/connections/pending", page, limit);
  }

  async findPendingOutgoing(
    page = 1,
    limit = 20,
  ): Promise<PaginatedConnections> {
    return this.fetchList("/connections/outgoing", page, limit);
  }

  async findAcceptedByUserId(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedConnections> {
    return this.fetchList(`/users/${userId}/connections`, page, limit);
  }

  async accept(id: string): Promise<Connection> {
    const response = await this.httpClient.request<ConnectionResponseDto>(
      `/connections/${id}/accept`,
      { method: "POST" },
    );
    return ConnectionMapper.fromApi(response);
  }

  async reject(id: string): Promise<Connection> {
    const response = await this.httpClient.request<ConnectionResponseDto>(
      `/connections/${id}/reject`,
      { method: "POST" },
    );
    return ConnectionMapper.fromApi(response);
  }

  async remove(id: string): Promise<void> {
    await this.httpClient.request<void>(`/connections/${id}`, {
      method: "DELETE",
    });
  }

  async block(userId: string): Promise<Connection> {
    const response = await this.httpClient.request<ConnectionResponseDto>(
      `/connections/block/${userId}`,
      { method: "POST" },
    );
    return ConnectionMapper.fromApi(response);
  }

  async unblock(userId: string): Promise<void> {
    await this.httpClient.request<void>(`/connections/block/${userId}`, {
      method: "DELETE",
    });
  }

  private async fetchList(
    path: string,
    page: number,
    limit: number,
  ): Promise<PaginatedConnections> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response =
      await this.httpClient.request<PaginatedConnectionsResponseDto>(
        `${path}?${params.toString()}`,
      );
    return PaginatedConnectionsMapper.fromApi(response);
  }
}
