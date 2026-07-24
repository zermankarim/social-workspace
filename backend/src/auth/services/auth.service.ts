import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { UserMapper } from '../../users/mappers/user.mapper';
import { clearAuthCookies, setAuthCookies } from '../utils/cookie';
import { JwtPayload } from '../types/jwt-payload';
import { SessionService, hashToken } from './session.service';
import { randomBytes, randomUUID } from 'crypto';
import { AppConfigService } from '../../infrastructure/config/services/config.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignupDto,
} from '../dto/auth.dto';
import { Prisma, ProfileRole } from '@prisma/client';
import { userPublicSelect } from '../../users/user.select';
import { MailService } from '../../mail/services/mail.service';

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly envConfig: AppConfigService,
    private readonly mailService: MailService,
  ) {}

  async signup(dto: SignupDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new BadRequestException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);

    const newUserToCreate: Prisma.UserCreateInput = {
      email: dto.email,
      passwordHash: hash,
      role: ProfileRole.USER,
      firstName: dto.firstName,
      lastName: dto.lastName,
      bio: dto.bio,
      location: dto.location ? { create: dto.location } : undefined,
    };

    const user = await this.prisma.user.create({
      data: newUserToCreate,
      select: userPublicSelect,
    });

    return { user: UserMapper.fromPrismaToResponse(user) };
  }

  async signin(dto: { email: string; password: string }, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { ...userPublicSelect, passwordHash: true },
    });

    if (!user) throw new BadRequestException('Wrong credentials');

    const { passwordHash, ...publicUser } = user;

    const ok = await bcrypt.compare(dto.password, passwordHash);
    if (!ok) throw new BadRequestException('Wrong credentials');

    const accessTokenExpiresAt = this.getAccessTokenExpiresAt();
    const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();

    const session = await this.sessionService.createSession({
      userId: publicUser.id,
      refreshTokenHash: `pending:${randomUUID()}`,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });

    const { accessToken, refreshToken } = this.issueTokens({
      userId: publicUser.id,
      email: publicUser.email,
      role: publicUser.role,
      sessionId: session.id,
    });

    await this.sessionService.rotateTokensByRefreshToken(
      session.id,
      refreshToken,
      {
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      },
    );

    setAuthCookies(res, accessToken, refreshToken, this.envConfig.cookies);

    return {
      message: 'Logged in',
      user: UserMapper.fromPrismaToResponse(publicUser),
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

    clearAuthCookies(res, this.envConfig.cookies);
    return { message: 'Logged out' };
  }

  /** Always returns a generic message — never reveals whether the email exists. */
  async requestPasswordReset(
    dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, firstName: true },
    });

    if (user) {
      const rawToken = randomBytes(32).toString('hex');
      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(rawToken),
          expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
        },
      });

      const resetUrl = `${this.envConfig.url.front}/reset-password?token=${rawToken}`;
      await this.mailService.send(
        user.email,
        'Reset your password',
        `<p>Hi ${user.firstName},</p>` +
          `<p>Click the link below to reset your password. This link expires in 1 hour and can be used once.</p>` +
          `<p><a href="${resetUrl}">${resetUrl}</a></p>` +
          `<p>If you didn't request this, you can safely ignore this email.</p>`,
      );
    }

    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(dto.token) },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // Force re-authentication everywhere after a password reset.
    await this.sessionService.revokeAllUserSessions(record.userId);

    return { message: 'Password has been reset. Please sign in.' };
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

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      clearAuthCookies(res, this.envConfig.cookies);
      throw new UnauthorizedException('Refresh token expired or invalid');
    }

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
      select: userPublicSelect,
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

    await this.sessionService.rotateTokensByRefreshToken(
      session.id,
      tokens.refreshToken,
      {
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      },
    );

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
      this.envConfig.cookies,
    );

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
    return this.envConfig.auth.jwtSecret;
  }

  private get refreshSecret(): string {
    return this.envConfig.auth.refreshJwtSecret;
  }

  private get accessTokenTtlSeconds(): number {
    return Number(this.envConfig.auth.accessTokenExpiresInSec);
  }

  private get refreshTokenTtlSeconds(): number {
    return Number(this.envConfig.auth.refreshTokenExpiresInSec);
  }
}
