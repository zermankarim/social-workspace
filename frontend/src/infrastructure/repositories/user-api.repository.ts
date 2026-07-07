import type { User } from "@/core/domain/entities/user.entity";
import { UserRepository } from "@/core/domain/repositories/user.repository";
import type {
  UserByIdResponseDto,
  UserResponseDto,
} from "@/infrastructure/api/dto/auth-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { UserMapper } from "@/infrastructure/mappers/user.mapper";

export class UserApiRepository extends UserRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async findAll(): Promise<User[]> {
    const response = await this.httpClient.request<UserResponseDto[]>("/users");
    return response.map((user) => UserMapper.fromApi(user));
  }

  async findById(id: string): Promise<User> {
    const response = await this.httpClient.request<UserByIdResponseDto>(
      `/users/${id}`,
    );
    return UserMapper.fromApi(response.user);
  }
}
