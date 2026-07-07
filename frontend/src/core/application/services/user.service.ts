import type { User } from "@/core/domain/entities/user.entity";
import type { UserRepository } from "@/core/domain/repositories/user.repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  getById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}
