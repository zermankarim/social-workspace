import type { Notification } from "@/core/domain/entities/notification.entity";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

export class PaginatedNotifications {
  constructor(
    public readonly data: Notification[],
    public readonly meta: PaginationMeta,
  ) {}
}
