import type { UserQueryDto } from "@/core/application/dtos/user-query.dto";
import type { PaginatedUsers } from "@/core/domain/entities/paginated-users.entity";
import type { User } from "@/core/domain/entities/user.entity";
import type { UserRepository } from "@/core/domain/repositories/user.repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getPaginated(query: UserQueryDto): Promise<PaginatedUsers> {
    return this.userRepository.findPaginated(query);
  }

  getById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}
