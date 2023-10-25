import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { SessionService } from '../session/session.service';
import { Request } from 'express';
import { responseMessages } from '../../common/messages/response.messages';
import { IUserSession } from '../../common/interfaces/session.interface';
import * as crypto from 'crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest() as Request;
    request.requestId = crypto.randomUUID();
    const token = this.sessionService.getBearerToken(request);
    let session: IUserSession;

    if (token) {
      session = await this.sessionService.getSession(token);
      if (session) request.session = session;
    }

    if (isPublic) {
      return true;
    }

    if (!token || !session) throw new UnauthorizedException(responseMessages.auth.unauthorized);

    return true;
  }
}
