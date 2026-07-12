import { ProfileService } from "@/core/application/services/profile.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ProfileApiRepository } from "@/infrastructure/repositories/profile-api.repository";

export class ProfileModule {
  static create(httpClient: HttpClient): ProfileService {
    return new ProfileService(new ProfileApiRepository(httpClient));
  }
}
