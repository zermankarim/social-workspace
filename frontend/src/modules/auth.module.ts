import { AuthService } from "@/core/application/services/auth.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { AuthApiRepository } from "@/infrastructure/repositories/auth-api.repository";

export class AuthModule {
  static create(httpClient: HttpClient): AuthService {
    const repository = new AuthApiRepository(httpClient);
    return new AuthService(repository);
  }
}
