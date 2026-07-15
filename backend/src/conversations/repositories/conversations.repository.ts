import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  conversationListSelect,
  ConversationListSelected,
  conversationSelect,
  ConversationSelected,
  messageSelect,
  MessageSelected,
  userDeviceSelect,
  UserDeviceSelected,
} from '../conversations.select';

@Injectable()
export class ConversationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<ConversationSelected | null> {
    return this.prisma.conversation.findUnique({
      where: { id },
      select: conversationSelect,
    });
  }

  findByIdForList(id: string): Promise<ConversationListSelected | null> {
    return this.prisma.conversation.findUnique({
      where: { id },
      select: conversationListSelect,
    });
  }

  findByDirectKey(directKey: string): Promise<ConversationSelected | null> {
    return this.prisma.conversation.findUnique({
      where: { directKey },
      select: conversationSelect,
    });
  }

  findByDirectKeyForList(
    directKey: string,
  ): Promise<ConversationListSelected | null> {
    return this.prisma.conversation.findUnique({
      where: { directKey },
      select: conversationListSelect,
    });
  }

  findManyForUser(
    userId: string,
    skip: number,
    take: number,
  ): Promise<ConversationListSelected[]> {
    return this.prisma.conversation.findMany({
      where: { members: { some: { userId } } },
      select: conversationListSelect,
      orderBy: { updatedAt: 'desc' },
      skip,
      take,
    });
  }

  countForUser(userId: string): Promise<number> {
    return this.prisma.conversation.count({
      where: { members: { some: { userId } } },
    });
  }

  isMember(conversationId: string, userId: string): Promise<boolean> {
    return this.prisma.conversationMember
      .findUnique({
        where: {
          conversationId_userId: { conversationId, userId },
        },
        select: { id: true },
      })
      .then((row) => row !== null);
  }

  createDirect(
    directKey: string,
    userAId: string,
    userBId: string,
  ): Promise<ConversationSelected> {
    return this.prisma.conversation.create({
      data: {
        directKey,
        members: {
          create: [{ userId: userAId }, { userId: userBId }],
        },
      },
      select: conversationSelect,
    });
  }

  markRead(conversationId: string, userId: string, at: Date): Promise<void> {
    return this.prisma.conversationMember
      .update({
        where: {
          conversationId_userId: { conversationId, userId },
        },
        data: { lastReadAt: at },
      })
      .then(() => undefined);
  }

  findMessages(
    conversationId: string,
    skip: number,
    take: number,
  ): Promise<MessageSelected[]> {
    return this.prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
      },
      select: messageSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countMessages(conversationId: string): Promise<number> {
    return this.prisma.message.count({
      where: {
        conversationId,
        deletedAt: null,
      },
    });
  }

  async countUnreadForConversation(
    conversationId: string,
    userId: string,
  ): Promise<number> {
    const member = await this.prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      select: { lastReadAt: true },
    });
    if (!member) {
      return 0;
    }

    return this.prisma.message.count({
      where: {
        conversationId,
        deletedAt: null,
        senderId: { not: userId },
        ...(member.lastReadAt ? { createdAt: { gt: member.lastReadAt } } : {}),
      },
    });
  }

  /**
   * Batch unread counts for conversations the user belongs to.
   */
  async countUnreadByConversationIds(
    userId: string,
    conversationIds: string[],
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    if (conversationIds.length === 0) {
      return result;
    }

    const members = await this.prisma.conversationMember.findMany({
      where: {
        userId,
        conversationId: { in: conversationIds },
      },
      select: { conversationId: true, lastReadAt: true },
    });

    await Promise.all(
      members.map(async (member) => {
        const count = await this.prisma.message.count({
          where: {
            conversationId: member.conversationId,
            deletedAt: null,
            senderId: { not: userId },
            ...(member.lastReadAt
              ? { createdAt: { gt: member.lastReadAt } }
              : {}),
          },
        });
        result.set(member.conversationId, count);
      }),
    );

    for (const id of conversationIds) {
      if (!result.has(id)) {
        result.set(id, 0);
      }
    }

    return result;
  }

  async countUnreadTotal(userId: string): Promise<number> {
    const members = await this.prisma.conversationMember.findMany({
      where: { userId },
      select: { conversationId: true, lastReadAt: true },
    });

    if (members.length === 0) {
      return 0;
    }

    const counts = await Promise.all(
      members.map((member) =>
        this.prisma.message.count({
          where: {
            conversationId: member.conversationId,
            deletedAt: null,
            senderId: { not: userId },
            ...(member.lastReadAt
              ? { createdAt: { gt: member.lastReadAt } }
              : {}),
          },
        }),
      ),
    );

    return counts.reduce((sum, n) => sum + n, 0);
  }

  async createMessageAndTouch(
    conversationId: string,
    data: Prisma.MessageCreateInput,
  ): Promise<MessageSelected> {
    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data,
        select: messageSelect,
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  }

  findDeviceForUser(
    devicePkId: string,
    userId: string,
  ): Promise<UserDeviceSelected | null> {
    return this.prisma.userDevice.findFirst({
      where: { id: devicePkId, userId },
      select: userDeviceSelect,
    });
  }
}
