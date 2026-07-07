import type { User } from "@/core/domain/entities/user.entity";
import type { AuthCredentials } from "@/core/domain/value-objects/auth-credentials.vo";

export abstract class AuthRepository {
  abstract signup(credentials: AuthCredentials): Promise<User>;
  abstract signin(credentials: AuthCredentials): Promise<User>;
  abstract signout(): Promise<void>;
  abstract refresh(): Promise<User>;
}
