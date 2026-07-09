import type { UserQueryDto } from "@/core/application/dtos/user-query.dto";
import type { PaginatedUsers } from "@/core/domain/entities/paginated-users.entity";
import type { User } from "@/core/domain/entities/user.entity";

export abstract class UserRepository {
  abstract findPaginated(query: UserQueryDto): Promise<PaginatedUsers>;
  abstract findById(id: string): Promise<User>;
}
