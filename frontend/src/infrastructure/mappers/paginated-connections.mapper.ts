import { PaginatedConnections } from "@/core/domain/entities/paginated-connections.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PaginatedConnectionsResponseDto } from "@/infrastructure/api/dto/connection-response.dto";
import { ConnectionMapper } from "@/infrastructure/mappers/connection.mapper";

export class PaginatedConnectionsMapper {
  static fromApi(dto: PaginatedConnectionsResponseDto): PaginatedConnections {
    return new PaginatedConnections(
      dto.data.map((item) => ConnectionMapper.fromApi(item)),
      new PaginationMeta(
        dto.meta.page,
        dto.meta.limit,
        dto.meta.total,
        dto.meta.totalPages,
        dto.meta.hasNextPage,
        dto.meta.hasPrevPage,
      ),
    );
  }
}
