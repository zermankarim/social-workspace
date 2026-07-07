import { UserService } from "@/core/application/services/user.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { UserApiRepository } from "@/infrastructure/repositories/user-api.repository";

export class UserModule {
  static create(httpClient: HttpClient): UserService {
    const repository = new UserApiRepository(httpClient);
    return new UserService(repository);
  }
}
