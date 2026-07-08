import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { AppConfigService } from '../../infrastructure/config/services/config.service';
import { SessionRepository } from '../repositories/session.repository';
import {
  CreateSessionInput,
  RotateSessionTokensInput,
} from '../types/session.types';
import { Prisma } from '@prisma/client';

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class SessionService {
  constructor(
    private readonly envConfig: AppConfigService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async createSession(input: CreateSessionInput) {
    const maxSessions = this.envConfig.auth.maxSessions;

    const sessions = await this.sessionRepository.count({
      userId: input.userId,
      revokedAt: null,
      refreshTokenExpiresAt: { gt: new Date() },
    });

    if (sessions >= maxSessions) {
      throw new BadRequestException('Max sessions reached');
    }
    return this.sessionRepository.create(input);
  }

  count(where: Prisma.SessionWhereInput): Promise<number> {
    return this.sessionRepository.count(where);
  }

  findActiveByRefreshTokenHash(refreshTokenHash: string) {
    return this.sessionRepository.findActiveByRefreshTokenHash(
      refreshTokenHash,
    );
  }

  findActiveByRefreshToken(refreshToken: string) {
    return this.findActiveByRefreshTokenHash(hashToken(refreshToken));
  }

  rotateTokens(sessionId: string, input: RotateSessionTokensInput) {
    return this.sessionRepository.rotateTokens(sessionId, input);
  }

  rotateTokensByRefreshToken(
    sessionId: string,
    refreshToken: string,
    input: Omit<RotateSessionTokensInput, 'refreshTokenHash'>,
  ) {
    return this.rotateTokens(sessionId, {
      ...input,
      refreshTokenHash: hashToken(refreshToken),
    });
  }

  revokeSession(sessionId: string) {
    return this.sessionRepository.revokeSession(sessionId);
  }

  revokeAllUserSessions(userId: string) {
    return this.sessionRepository.revokeAllUserSessions(userId);
  }

  deleteExpiredSessions(now = new Date()) {
    return this.sessionRepository.deleteExpiredSessions(now);
  }
}
