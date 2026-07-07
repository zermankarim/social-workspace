import type { User } from "@/core/domain/entities/user.entity";
import type { AuthCredentials } from "@/core/domain/value-objects/auth-credentials.vo";
import type { AuthRepository } from "@/core/domain/repositories/auth.repository";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  signup(credentials: AuthCredentials): Promise<User> {
    return this.authRepository.signup(credentials);
  }

  signin(credentials: AuthCredentials): Promise<User> {
    return this.authRepository.signin(credentials);
  }

  signout(): Promise<void> {
    return this.authRepository.signout();
  }

  refresh(): Promise<User> {
    return this.authRepository.refresh();
  }

  async register(credentials: AuthCredentials): Promise<User> {
    await this.authRepository.signup(credentials);
    return this.authRepository.signin(credentials);
  }
}
