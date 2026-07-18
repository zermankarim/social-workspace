import { ProfileViewService } from "@/core/application/services/profile-view.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ProfileViewApiRepository } from "@/infrastructure/repositories/profile-view-api.repository";

export class ProfileViewModule {
  static create(httpClient: HttpClient): ProfileViewService {
    return new ProfileViewService(new ProfileViewApiRepository(httpClient));
  }
}
