import { Injectable } from '@nestjs/common';
import { NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  notificationSelect,
  NotificationSelected,
} from '../notification.select';

export type CreateNotificationInput = {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId?: string | null;
};

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateNotificationInput): Promise<NotificationSelected> {
    return this.prisma.notification.create({
      data: {
        type: input.type,
        recipient: { connect: { id: input.recipientId } },
        actor: { connect: { id: input.actorId } },
        ...(input.postId ? { post: { connect: { id: input.postId } } } : {}),
      },
      select: notificationSelect,
    });
  }

  findManyByRecipient(
    recipientId: string,
    skip: number,
    take: number,
  ): Promise<NotificationSelected[]> {
    return this.prisma.notification.findMany({
      where: { recipientId },
      select: notificationSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countByRecipient(recipientId: string): Promise<number> {
    return this.prisma.notification.count({ where: { recipientId } });
  }

  countUnread(recipientId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { recipientId, read: false },
    });
  }

  findById(id: string): Promise<{ id: string; recipientId: string } | null> {
    return this.prisma.notification.findUnique({
      where: { id },
      select: { id: true, recipientId: true },
    });
  }

  markRead(id: string): Promise<NotificationSelected> {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
      select: notificationSelect,
    });
  }

  markAllRead(recipientId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.notification.updateMany({
      where: { recipientId, read: false },
      data: { read: true },
    });
  }

  async findPostAuthorId(postId: string): Promise<string | null> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    return post?.authorId ?? null;
  }
}
