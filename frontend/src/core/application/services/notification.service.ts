import type { Notification } from "@/core/domain/entities/notification.entity";
import type { PaginatedNotifications } from "@/core/domain/entities/paginated-notifications.entity";
import type { NotificationRepository } from "@/core/domain/repositories/notification.repository";

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  list(page = 1, limit = 20): Promise<PaginatedNotifications> {
    return this.notificationRepository.list(page, limit);
  }

  getUnreadCount(): Promise<number> {
    return this.notificationRepository.getUnreadCount();
  }

  markRead(id: string): Promise<Notification> {
    return this.notificationRepository.markRead(id);
  }

  markAllRead(): Promise<void> {
    return this.notificationRepository.markAllRead();
  }
}
