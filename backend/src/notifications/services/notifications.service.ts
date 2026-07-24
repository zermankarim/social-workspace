import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from '@prisma/client';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { NotificationsMapper } from '../mappers/notifications.mapper';
import { NotificationResponseDto } from '../dto/notification.dto';
import { NotificationSelected } from '../notification.select';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

/** Consumed by MessagingGateway to push over the existing `/ws` socket — decoupled via events to avoid a module import cycle (Notifications -> Conversations -> Connections -> Notifications). */
export const NOTIFICATION_CREATED_EVENT = 'notification.created';

export type NotificationCreatedEvent = {
  recipientId: string;
  notification: NotificationResponseDto;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async list(
    recipientId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<NotificationResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [items, total] = await Promise.all([
      this.notificationsRepository.findManyByRecipient(recipientId, skip, take),
      this.notificationsRepository.countByRecipient(recipientId),
    ]);

    return {
      data: items.map((item) => NotificationsMapper.toResponseDto(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async getUnreadCount(recipientId: string): Promise<number> {
    return this.notificationsRepository.countUnread(recipientId);
  }

  public async markRead(
    recipientId: string,
    notificationId: string,
  ): Promise<NotificationResponseDto> {
    const existing =
      await this.notificationsRepository.findById(notificationId);
    if (!existing || existing.recipientId !== recipientId) {
      throw new ForbiddenException('Not your notification');
    }
    const updated = await this.notificationsRepository.markRead(notificationId);
    return NotificationsMapper.toResponseDto(updated);
  }

  public async markAllRead(recipientId: string): Promise<void> {
    await this.notificationsRepository.markAllRead(recipientId);
  }

  /**
   * Notify the author of a post about an interaction (like, comment, repost).
   * No-op when the actor is the post author. Failures are swallowed so the
   * primary action is never blocked by notification bookkeeping.
   */
  public async notifyPostInteraction(
    actorId: string,
    postId: string,
    type: NotificationType,
  ): Promise<void> {
    try {
      const recipientId =
        await this.notificationsRepository.findPostAuthorId(postId);
      if (!recipientId || recipientId === actorId) return;
      const created = await this.notificationsRepository.create({
        recipientId,
        actorId,
        type,
        postId,
      });
      this.emitCreated(recipientId, created);
    } catch (error) {
      this.logger.warn(
        `Failed to create ${type} notification for post ${postId}: ${String(error)}`,
      );
    }
  }

  public async notifyConnectionRequest(
    requesterId: string,
    addresseeId: string,
  ): Promise<void> {
    await this.safeCreate({
      recipientId: addresseeId,
      actorId: requesterId,
      type: NotificationType.CONNECTION_REQUEST,
    });
  }

  public async notifyConnectionAccepted(
    accepterId: string,
    requesterId: string,
  ): Promise<void> {
    await this.safeCreate({
      recipientId: requesterId,
      actorId: accepterId,
      type: NotificationType.CONNECTION_ACCEPTED,
    });
  }

  public async notifyCommentReply(
    actorId: string,
    commentAuthorId: string,
    postId: string,
  ): Promise<void> {
    await this.safeCreate({
      recipientId: commentAuthorId,
      actorId,
      type: NotificationType.COMMENT_REPLY,
      postId,
    });
  }

  public async notifyNewFollower(
    followerId: string,
    followingId: string,
  ): Promise<void> {
    await this.safeCreate({
      recipientId: followingId,
      actorId: followerId,
      type: NotificationType.NEW_FOLLOWER,
    });
  }

  public async notifyProfileView(
    viewerId: string,
    profileOwnerId: string,
  ): Promise<void> {
    await this.safeCreate({
      recipientId: profileOwnerId,
      actorId: viewerId,
      type: NotificationType.PROFILE_VIEW,
    });
  }

  private async safeCreate(input: {
    recipientId: string;
    actorId: string;
    type: NotificationType;
    postId?: string | null;
  }): Promise<void> {
    if (input.recipientId === input.actorId) return;
    try {
      const created = await this.notificationsRepository.create(input);
      this.emitCreated(input.recipientId, created);
    } catch (error) {
      this.logger.warn(
        `Failed to create ${input.type} notification: ${String(error)}`,
      );
    }
  }

  private emitCreated(
    recipientId: string,
    notification: NotificationSelected,
  ): void {
    const event: NotificationCreatedEvent = {
      recipientId,
      notification: NotificationsMapper.toResponseDto(notification),
    };
    this.eventEmitter.emit(NOTIFICATION_CREATED_EVENT, event);
  }
}
