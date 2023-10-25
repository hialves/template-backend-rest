import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';

import { ConfigService } from '@nestjs/config';
import { ILoginUser } from '../../common/interfaces/login-user.interface';
import dayjs from 'dayjs';
import ms from 'ms';
import { Request } from 'express';
import { CacheService } from '../../shared/cache/cache.service';
import { cacheKeys } from '../../common/cache/cache-keys';
import { IUserSession } from '../../common/interfaces/session.interface';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class SessionService {
  private readonly sessionDurationInMs: number;

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    configService: ConfigService,
  ) {
    this.sessionDurationInMs = ms(configService.get('SESSION_DURATION'));
  }

  get repository() {
    return this.prisma.session;
  }

  async createAuthenticatedSession(user: ILoginUser, request: Request) {
    const token = await this.generateAuthToken();
    await this.repository.create({
      data: {
        token,
        userId: user.id,
        expiresAt: this.getExpiryDate(this.sessionDurationInMs),
        device: request.headers['user-agent'],
        valid: true,
        ip: request.ip,
      },
    });

    return token;
  }

  private getExpiryDate(timeInMs: number): string {
    return dayjs().add(timeInMs, 'milliseconds').toISOString();
  }

  private generateAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) return reject(err);
        resolve(buffer.toString('hex'));
      });
    });
  }

  getBearerToken(request: Request): string | undefined {
    const bearerToken = request.header('Authorization');

    if (bearerToken) {
      const match = bearerToken.trim().match(/^bearer\s(.+)$/i);
      if (match) {
        return match[1];
      }
    }
  }

  async getSession(token: string): Promise<IUserSession | undefined> {
    const cachedSession = await this.getCachedSession(token);
    if (cachedSession && this.validateSession(cachedSession)) {
      return cachedSession;
    }
    const session = await this.repository.findUnique({ where: { token } });

    if (!session) return;

    const { id, expiresAt, valid, userId } = session;
    await this.setCacheSession(token, { id, token, expiresAt, valid, userId });
    return session;
  }

  async deleteSession(session: IUserSession): Promise<void> {
    try {
      await this.repository.delete({ where: { id: session.id } });
      const key = this.getCacheKey(session.token);
      await this.cache.del(key);

      return;
    } catch (error) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  private getCachedSession(token: string): Promise<IUserSession | undefined> {
    const key = this.getCacheKey(token);
    return this.cache.get(key);
  }

  private validateSession(session: IUserSession) {
    if (dayjs().isAfter(session.expiresAt)) return false;
    return session.token && session.valid;
  }

  private setCacheSession(token: string, session: IUserSession) {
    const key = this.getCacheKey(token);
    return this.cache.set(key, session);
  }

  private getCacheKey(token: string) {
    return cacheKeys.auth.session(token);
  }
}
