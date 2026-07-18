import type { Notification } from "@/core/domain/entities/notification.entity";
import type { PaginatedNotifications } from "@/core/domain/entities/paginated-notifications.entity";

export abstract class NotificationRepository {
  abstract list(page?: number, limit?: number): Promise<PaginatedNotifications>;
  abstract getUnreadCount(): Promise<number>;
  abstract markRead(id: string): Promise<Notification>;
  abstract markAllRead(): Promise<void>;
}
