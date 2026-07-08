import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ProfileRole } from '@prisma/client';
import { RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ProfileRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request: RequestWithJwtPayload = context.switchToHttp().getRequest();

    const jwtPayload = request.user;

    return requiredRoles.includes(jwtPayload.role);
  }
}
