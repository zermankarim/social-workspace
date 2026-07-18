import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { NotificationsMapper } from '../mappers/notifications.mapper';
import { NotificationResponseDto } from '../dto/notification.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
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
      await this.notificationsRepository.create({
        recipientId,
        actorId,
        type,
        postId,
      });
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
      await this.notificationsRepository.create(input);
    } catch (error) {
      this.logger.warn(
        `Failed to create ${input.type} notification: ${String(error)}`,
      );
    }
  }
}
