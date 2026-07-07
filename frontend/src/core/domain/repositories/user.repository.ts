import type { User } from "@/core/domain/entities/user.entity";

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User>;
}
