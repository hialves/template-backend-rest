import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { UserService } from '../../modules/user/user.service';
import { CacheService } from '../config/cache/cache.service';
import { cacheKeys } from '../config/cache/cache-keys';
import ms from 'ms';
import { Role } from '@prisma/client';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private cache: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest() as Request;
    const session = request.session;

    const key = cacheKeys.session.userById(session.userId);
    const user = await this.cache.getAndSave(key, () => this.userService.findOne(session.userId), ms('1hour'));

    return requiredRoles.some((role) => user.role === role);
  }
}
