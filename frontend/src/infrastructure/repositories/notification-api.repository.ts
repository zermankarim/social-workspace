import type { Notification } from "@/core/domain/entities/notification.entity";
import type { PaginatedNotifications } from "@/core/domain/entities/paginated-notifications.entity";
import { NotificationRepository } from "@/core/domain/repositories/notification.repository";
import type {
  NotificationResponseDto,
  PaginatedNotificationsResponseDto,
  UnreadNotificationsCountResponseDto,
} from "@/infrastructure/api/dto/notification-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { NotificationMapper } from "@/infrastructure/mappers/notification.mapper";

export class NotificationApiRepository extends NotificationRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async list(page = 1, limit = 20): Promise<PaginatedNotifications> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response =
      await this.httpClient.request<PaginatedNotificationsResponseDto>(
        `/notifications?${params.toString()}`,
      );
    return NotificationMapper.paginatedFromApi(response);
  }

  async getUnreadCount(): Promise<number> {
    const response =
      await this.httpClient.request<UnreadNotificationsCountResponseDto>(
        "/notifications/unread-count",
      );
    return response.count;
  }

  async markRead(id: string): Promise<Notification> {
    const response = await this.httpClient.request<NotificationResponseDto>(
      `/notifications/${id}/read`,
      { method: "PATCH" },
    );
    return NotificationMapper.fromApi(response);
  }

  async markAllRead(): Promise<void> {
    await this.httpClient.request<void>("/notifications/read-all", {
      method: "PATCH",
    });
  }
}
