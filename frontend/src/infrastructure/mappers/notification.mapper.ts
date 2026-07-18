import { Notification } from "@/core/domain/entities/notification.entity";
import { PaginatedNotifications } from "@/core/domain/entities/paginated-notifications.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import { NotificationType } from "@/core/domain/enums/notification-type.enum";
import type {
  NotificationResponseDto,
  PaginatedNotificationsResponseDto,
} from "@/infrastructure/api/dto/notification-response.dto";
import { PostMapper } from "@/infrastructure/mappers/post.mapper";

function parseType(type: string): NotificationType {
  return (Object.values(NotificationType) as string[]).includes(type)
    ? (type as NotificationType)
    : NotificationType.POST_LIKE;
}

export class NotificationMapper {
  static fromApi(dto: NotificationResponseDto): Notification {
    return new Notification(
      dto.id,
      parseType(dto.type),
      dto.read,
      PostMapper.authorFromApi(dto.actor),
      dto.post ? { id: dto.post.id, textContent: dto.post.textContent } : null,
      new Date(dto.createdAt),
    );
  }

  static paginatedFromApi(
    dto: PaginatedNotificationsResponseDto,
  ): PaginatedNotifications {
    return new PaginatedNotifications(
      dto.data.map((item) => NotificationMapper.fromApi(item)),
      new PaginationMeta(
        dto.meta.page,
        dto.meta.limit,
        dto.meta.total,
        dto.meta.totalPages,
        dto.meta.hasNextPage,
        dto.meta.hasPrevPage,
      ),
    );
  }
}
