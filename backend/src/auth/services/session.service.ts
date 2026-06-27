import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppConfigService } from '../../infrastructure/config/services/config.service';

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

type CreateSessionInput = {
  userId: string;
  refreshTokenHash: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
};

type RotateSessionTokensInput = {
  refreshTokenHash: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
};

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly envConfig: AppConfigService,
  ) {}

  async createSession(input: CreateSessionInput) {
    const maxSessions = this.envConfig.auth.maxSessions;

    const sessions = await this.prisma.session.count({
      where: {
        userId: input.userId,
        revokedAt: null,
        refreshTokenExpiresAt: { gt: new Date() },
      },
    });

    if (sessions >= maxSessions) {
      throw new BadRequestException('Max sessions reached');
    }
    return this.prisma.session.create({
      data: input,
    });
  }

  findActiveByRefreshToken(refreshToken: string) {
    return this.findActiveByRefreshTokenHash(hashToken(refreshToken));
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
