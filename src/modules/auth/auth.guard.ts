import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { SessionService } from '../session/session.service';
import { Request } from 'express';
import { responseMessages } from '../../common/messages/response.messages';
import * as crypto from 'crypto';
import { JwtPayload } from '../../common/interfaces/jwt.interface';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest() as Request;
    request.requestId = crypto.randomUUID();
    const token = SessionService.getBearerToken(request);
    let session: JwtPayload | undefined;
    if (token) {
      session = jwt.verify(token, this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY')!) as JwtPayload;
      if (session) request.session = session;
    }

    if (isPublic) return true;

    if (!token || !session) throw new UnauthorizedException(responseMessages.auth.unauthorized);

    return true;
  }
}
