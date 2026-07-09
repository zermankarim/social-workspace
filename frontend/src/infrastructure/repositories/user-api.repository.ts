import type { UserQueryDto } from "@/core/application/dtos/user-query.dto";
import type { PaginatedUsers } from "@/core/domain/entities/paginated-users.entity";
import type { User } from "@/core/domain/entities/user.entity";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import type { UserResponseDto } from "@/infrastructure/api/dto/auth-response.dto";
import type { PaginatedUsersResponseDto } from "@/infrastructure/api/dto/user-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { PaginatedUsersMapper } from "@/infrastructure/mappers/paginated-users.mapper";
import { UserMapper } from "@/infrastructure/mappers/user.mapper";

export class UserApiRepository extends UserRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async findPaginated(query: UserQueryDto): Promise<PaginatedUsers> {
    const params = new URLSearchParams({
      page: String(query.page),
      limit: String(query.limit),
      sortBy: query.sortBy,
      orderBy: query.orderBy,
    });

    if (query.search) {
      params.set("search", query.search);
    }

    const response = await this.httpClient.request<PaginatedUsersResponseDto>(
      `/admin/users?${params.toString()}`,
    );

    return PaginatedUsersMapper.fromApi(response);
  }

  async findById(id: string): Promise<User> {
    const response = await this.httpClient.request<UserResponseDto>(
      `/admin/users/${id}`,
    );
    return UserMapper.fromApi(response);
  }
}
