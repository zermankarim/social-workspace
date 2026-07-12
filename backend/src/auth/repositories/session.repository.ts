import { Prisma, Session } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateSessionInput,
  RotateSessionTokensInput,
} from '../types/session.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateSessionInput): Promise<Session> {
    return this.prisma.session.create({ data: input });
  }

  count(where: Prisma.SessionWhereInput): Promise<number> {
    return this.prisma.session.count({ where });
  }

  findActiveByRefreshTokenHash(refreshTokenHash: string) {
    return this.prisma.session.findFirst({
      where: {
        refreshTokenHash,
        revokedAt: null,
      },
    });
  }

  rotateTokens(sessionId: string, input: RotateSessionTokensInput) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: input,
    });
  }

  revokeSession(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  revokeAllUserSessions(userId: string) {
    return this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  findOldestActiveSessions(userId: string, take: number): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        refreshTokenExpiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'asc' },
      take,
    });
  }

  deleteExpiredSessions(now = new Date()) {
    return this.prisma.session.deleteMany({
      where: {
        OR: [
          { refreshTokenExpiresAt: { lt: now } },
          { revokedAt: { not: null } },
        ],
      },
    });
  }
}
