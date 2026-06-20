import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import jwtConfig from './config/jwt.config';
import refreshJwtConfig from './config/refresh-jwt.config';

import type { ConfigType } from '@nestjs/config';
import { UserMapper } from '../users/user.mapper';
import { clearAuthCookies, setAuthCookies } from './utils/cookie';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private accessConfig: ConfigType<typeof jwtConfig>,

    @Inject(refreshJwtConfig.KEY)
    private refreshConfig: ConfigType<typeof refreshJwtConfig>,
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

    const { accessToken, refreshToken } = this.issueTokens({
      id: user.id,
      email: user.email,
    });
    setAuthCookies(res, accessToken, refreshToken);

    return {
      message: 'Logged in',
      user: UserMapper.fromPrismaToResponse(user),
    };
  }

  signout(res: Response) {
    clearAuthCookies(res);
    return { message: 'Logged out' };
  }

  private issueTokens(user: { id: string; email: string }) {
    const payload = { userId: user.id, email: user.email };

    const accessToken = this.jwtService.sign(
      payload,
      this.accessConfig.signOptions,
    );

    const refreshToken = this.jwtService.sign(payload, this.refreshConfig);

    return { accessToken, refreshToken };
  }

  async refresh(payload: JwtPayload, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { accessToken, refreshToken } = this.issueTokens({
      id: user.id,
      email: user.email,
    });

    setAuthCookies(res, accessToken, refreshToken);

    return {
      message: 'Tokens refreshed',
      user: UserMapper.fromPrismaToResponse(user),
    };
  }
}
