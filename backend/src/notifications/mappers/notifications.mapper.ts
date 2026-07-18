import { NotificationResponseDto } from '../dto/notification.dto';
import { NotificationSelected } from '../notification.select';

export class NotificationsMapper {
  public static toResponseDto(
    notification: NotificationSelected,
  ): NotificationResponseDto {
    return {
      id: notification.id,
      type: notification.type,
      read: notification.read,
      createdAt: notification.createdAt,
      actor: notification.actor,
      post: notification.post
        ? {
            id: notification.post.id,
            textContent: notification.post.textContent,
          }
        : null,
    };
  }
}
