import { NotificationService } from "@/core/application/services/notification.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { NotificationApiRepository } from "@/infrastructure/repositories/notification-api.repository";

export class NotificationModule {
  static create(httpClient: HttpClient): NotificationService {
    const repository = new NotificationApiRepository(httpClient);
    return new NotificationService(repository);
  }
}
