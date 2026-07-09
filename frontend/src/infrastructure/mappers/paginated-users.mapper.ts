import { PaginatedUsers } from "@/core/domain/entities/paginated-users.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PaginatedUsersResponseDto } from "@/infrastructure/api/dto/user-response.dto";
import { UserMapper } from "@/infrastructure/mappers/user.mapper";

export class PaginatedUsersMapper {
  static fromApi(dto: PaginatedUsersResponseDto): PaginatedUsers {
    return new PaginatedUsers(
      dto.data.map((user) => UserMapper.fromApi(user)),
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
