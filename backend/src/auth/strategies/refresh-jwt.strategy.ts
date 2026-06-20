import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import type { ConfigType } from '@nestjs/config';

import refreshJwtConfig from '../config/refresh-jwt.config';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    refreshConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req.cookies?.refresh_token as string) ?? null,
      ]),
      secretOrKey: refreshConfiguration.secret as string,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
