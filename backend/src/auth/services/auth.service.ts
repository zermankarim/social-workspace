import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { UserMapper } from '../../users/user.mapper';
import { clearAuthCookies, setAuthCookies } from '../utils/cookie';
import { JwtPayload } from '../types/jwt-payload';
import { SessionService, hashToken } from './session.service';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: { email: string; password: string }) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new BadRequestException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
        role: 'USER',
      },
    });

    return { user: UserMapper.fromPrismaToResponse(user) };
  }

  async signin(dto: { email: string; password: string }, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new BadRequestException('Wrong credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new BadRequestException('Wrong credentials');

    const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
    const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();

    const session = await this.sessionService.createSession({
      userId: user.id,
      refreshTokenHash: `pending:${randomUUID()}`,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });

    const { accessToken, refreshToken } = this.issueTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    await this.sessionService.rotateTokens(session.id, {
      refreshTokenHash: hashToken(refreshToken),
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });

    setAuthCookies(res, accessToken, refreshToken);

    return {
      message: 'Logged in',
      user: UserMapper.fromPrismaToResponse(user),
    };
  }

  async signout(refreshToken: string | undefined, res: Response) {
    if (refreshToken) {
      const session =
        await this.sessionService.findActiveByRefreshToken(refreshToken);

      if (session) {
        await this.sessionService.revokeSession(session.id);
      }
    }

    clearAuthCookies(res);
    return { message: 'Logged out' };
  }

  private issueTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessTokenTtlSeconds,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshTokenTtlSeconds,
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string | undefined, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(
      refreshToken,
      {
        secret: this.refreshSecret,
      },
    );

    const session =
      await this.sessionService.findActiveByRefreshToken(refreshToken);

    if (!session) {
      throw new UnauthorizedException('Session not found or revoked');
    }

    if (session.refreshTokenExpiresAt < new Date()) {
      await this.sessionService.revokeSession(session.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    if (session.userId !== payload.userId || session.id !== payload.sessionId) {
      await this.sessionService.revokeSession(session.id);
      throw new UnauthorizedException('Invalid session token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      await this.sessionService.revokeSession(session.id);
      throw new UnauthorizedException('User not found');
    }

    const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
    const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();

    const tokens = this.issueTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    await this.sessionService.rotateTokens(session.id, {
      refreshTokenHash: hashToken(tokens.refreshToken),
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      message: 'Tokens refreshed',
      user: UserMapper.fromPrismaToResponse(user),
    };
  }

  private getExpiresAtFromSeconds(ttlSeconds: number): Date {
    if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
      throw new Error('Invalid token expiration');
    }

    return new Date(Date.now() + ttlSeconds * 1000);
  }

  private getAccessTokenExpiresAt(): Date {
    return this.getExpiresAtFromSeconds(this.accessTokenTtlSeconds);
  }

  private getRefreshTokenExpiresAt(): Date {
    return this.getExpiresAtFromSeconds(this.refreshTokenTtlSeconds);
  }

  private get accessSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  private get refreshSecret(): string {
    return this.configService.getOrThrow<string>('REFRESH_JWT_SECRET');
  }

  private get accessTokenTtlSeconds(): number {
    return Number(
      this.configService.getOrThrow<string>('JWT_EXPIRE_IN_SECONDS'),
    );
  }

  private get refreshTokenTtlSeconds(): number {
    return Number(
      this.configService.getOrThrow<string>('REFRESH_JWT_EXPIRE_IN_SECONDS'),
    );
  }
}
