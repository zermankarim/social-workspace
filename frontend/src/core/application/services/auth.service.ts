import type { User } from "@/core/domain/entities/user.entity";
import type { AuthRepository } from "@/core/domain/repositories/auth.repository";
import { AuthCredentials } from "@/core/domain/value-objects/auth-credentials.vo";
import type { SignupData } from "@/core/domain/value-objects/signup-data.vo";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  signup(data: SignupData): Promise<User> {
    return this.authRepository.signup(data);
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

  async register(data: SignupData): Promise<User> {
    await this.authRepository.signup(data);
    return this.authRepository.signin(
      new AuthCredentials(data.email, data.password),
    );
  }
}
