import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import type { ConfigType } from '@nestjs/config';

import jwtConfig from '../config/jwt.config';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req.cookies?.access_token as string) ?? null,
      ]),
      secretOrKey: jwtConfiguration.secret as string,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
