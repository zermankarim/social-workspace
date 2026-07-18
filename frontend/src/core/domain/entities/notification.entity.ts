import type { PostAuthor } from "@/core/domain/entities/post-author.entity";
import type { NotificationType } from "@/core/domain/enums/notification-type.enum";

export type NotificationPostPreview = {
  id: string;
  textContent: string | null;
};

export class Notification {
  constructor(
    public readonly id: string,
    public readonly type: NotificationType,
    public readonly read: boolean,
    public readonly actor: PostAuthor,
    public readonly post: NotificationPostPreview | null,
    public readonly createdAt: Date,
  ) {}
}
