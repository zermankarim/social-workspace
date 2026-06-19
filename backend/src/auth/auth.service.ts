import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '../utils/constants';
import type { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (foundUser) {
      throw new BadRequestException('Emain already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'USER',
      },
    });

    return {
      message: 'signup was successfull',
    };
  }
  async signin(dto: AuthDto, req: Request, res: Response) {
    const { email, password } = dto;

    const credentialsErrorText = 'Wrong credentials';

    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (!foundUser) {
      throw new BadRequestException(credentialsErrorText);
    }

    const isMatch = await this.isMatchPassword({
      password,
      hashedPassoword: foundUser.passwordHash,
    });

    if (!isMatch) {
      throw new BadRequestException(credentialsErrorText);
    }

    // Sign jwt and return to the user
    const token = this.signToken({
      userId: foundUser.id,
      email: foundUser.email,
    });

    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('token', token);

    return res.send({ message: 'Logged in successfully' });
  }
  signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out successfully' });
  }

  // Helpers
  async hashPassword(password: string) {
    const saltOrRounds = 10;

    return await bcrypt.hash(password, saltOrRounds);
  }

  async isMatchPassword(args: { password: string; hashedPassoword: string }) {
    return await bcrypt.compare(args.password, args.hashedPassoword);
  }

  signToken(args: { userId: string; email: string }) {
    const payload = args;

    return this.jwt.sign(payload, { secret: JWT_SECRET });
  }
}
