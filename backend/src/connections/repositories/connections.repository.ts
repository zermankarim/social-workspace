import { Injectable } from '@nestjs/common';
import { ConnectionStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { connectionSelect, ConnectionSelected } from '../connections.select';

@Injectable()
export class ConnectionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  userExists(userId: string): Promise<boolean> {
    return this.prisma.user
      .findUnique({ where: { id: userId }, select: { id: true } })
      .then((user) => user !== null);
  }

  findById(id: string): Promise<ConnectionSelected | null> {
    return this.prisma.connection.findUnique({
      where: { id },
      select: connectionSelect,
    });
  }

  findBetweenUsers(
    userAId: string,
    userBId: string,
  ): Promise<ConnectionSelected | null> {
    return this.prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId: userAId, addresseeId: userBId },
          { requesterId: userBId, addresseeId: userAId },
        ],
      },
      select: connectionSelect,
    });
  }

  create(
    requesterId: string,
    addresseeId: string,
  ): Promise<ConnectionSelected> {
    return this.prisma.connection.create({
      data: {
        requesterId,
        addresseeId,
        status: ConnectionStatus.PENDING,
      },
      select: connectionSelect,
    });
  }

  /** `requesterId` is the blocker by convention on a BLOCKED row. */
  createBlocked(
    blockerId: string,
    blockedId: string,
  ): Promise<ConnectionSelected> {
    return this.prisma.connection.create({
      data: {
        requesterId: blockerId,
        addresseeId: blockedId,
        status: ConnectionStatus.BLOCKED,
      },
      select: connectionSelect,
    });
  }

  updateStatus(
    id: string,
    status: ConnectionStatus,
  ): Promise<ConnectionSelected> {
    return this.prisma.connection.update({
      where: { id },
      data: { status },
      select: connectionSelect,
    });
  }

  deleteById(id: string): Promise<void> {
    return this.prisma.connection
      .delete({ where: { id } })
      .then(() => undefined);
  }

  findAcceptedByUserId(
    userId: string,
    skip: number,
    take: number,
  ): Promise<ConnectionSelected[]> {
    return this.findMany(
      {
        status: ConnectionStatus.ACCEPTED,
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      skip,
      take,
    );
  }

  countAcceptedByUserId(userId: string): Promise<number> {
    return this.count({
      status: ConnectionStatus.ACCEPTED,
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    });
  }

  /**
   * Peer user ids for all ACCEPTED connections (no pagination).
   * Used for presence fan-out.
   */
  async findAcceptedPeerUserIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.connection.findMany({
      where: {
        status: ConnectionStatus.ACCEPTED,
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: { requesterId: true, addresseeId: true },
    });

    return rows.map((row) =>
      row.requesterId === userId ? row.addresseeId : row.requesterId,
    );
  }

  findPendingIncomingByUserId(
    userId: string,
    skip: number,
    take: number,
  ): Promise<ConnectionSelected[]> {
    return this.findMany(
      {
        addresseeId: userId,
        status: ConnectionStatus.PENDING,
      },
      skip,
      take,
    );
  }

  countPendingIncomingByUserId(userId: string): Promise<number> {
    return this.count({
      addresseeId: userId,
      status: ConnectionStatus.PENDING,
    });
  }

  findPendingOutgoingByUserId(
    userId: string,
    skip: number,
    take: number,
  ): Promise<ConnectionSelected[]> {
    return this.findMany(
      {
        requesterId: userId,
        status: ConnectionStatus.PENDING,
      },
      skip,
      take,
    );
  }

  countPendingOutgoingByUserId(userId: string): Promise<number> {
    return this.count({
      requesterId: userId,
      status: ConnectionStatus.PENDING,
    });
  }

  /** Every user with ANY connection row with me — pending/accepted/rejected/blocked, both directions. Used to exclude from suggestions. */
  async findRelatedUserIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.connection.findMany({
      where: { OR: [{ requesterId: userId }, { addresseeId: userId }] },
      select: { requesterId: true, addresseeId: true },
    });
    return rows.map((row) =>
      row.requesterId === userId ? row.addresseeId : row.requesterId,
    );
  }

  /** ACCEPTED connections touching any of `userIds` — used to compute 2nd-degree mutual-connection counts. */
  findConnectionsAmong(
    userIds: string[],
  ): Promise<{ requesterId: string; addresseeId: string }[]> {
    if (userIds.length === 0) return Promise.resolve([]);
    return this.prisma.connection.findMany({
      where: {
        status: ConnectionStatus.ACCEPTED,
        OR: [
          { requesterId: { in: userIds } },
          { addresseeId: { in: userIds } },
        ],
      },
      select: { requesterId: true, addresseeId: true },
    });
  }

  findRecentUsersExcluding(
    excludeIds: string[],
    limit: number,
  ): Promise<
    {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
      headline: string | null;
    }[]
  > {
    return this.prisma.user.findMany({
      where: { id: { notIn: excludeIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        headline: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  getUsersBasicInfo(userIds: string[]): Promise<
    {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
      headline: string | null;
    }[]
  > {
    return this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        headline: true,
      },
    });
  }

  private findMany(
    where: Prisma.ConnectionWhereInput,
    skip: number,
    take: number,
  ): Promise<ConnectionSelected[]> {
    return this.prisma.connection.findMany({
      where,
      select: connectionSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  private count(where: Prisma.ConnectionWhereInput): Promise<number> {
    return this.prisma.connection.count({ where });
  }
}
