import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '../utils/constants';
import { Request } from 'express';

interface RequestWithCookies extends Request {
  cookies: {
    token?: string;
  };
}

const extractJWT = (req: RequestWithCookies): string | null => {
  return req.cookies?.token ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJWT]),
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: { id: string; email: string }) {
    return payload;
  }
}
