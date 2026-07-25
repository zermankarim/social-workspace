import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Same `jwt` strategy as JwtAuthGuard, but never rejects — used on public
 * endpoints that render differently for a logged-in viewer (e.g. "can I
 * manage this company page?") without requiring a session to view them.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(_err: unknown, user: TUser): TUser {
    return user;
  }
}
