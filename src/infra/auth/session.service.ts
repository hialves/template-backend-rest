import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import dayjs from 'dayjs';
import ms from 'ms';
import { Request } from 'express';
import { Session } from '@prisma/client';

import { PrismaService } from '../persistence/prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt.interface';
import { ID } from '../../@types';
import { User } from '../../domain/entities/user';

type UserSession = Required<Pick<User, 'id' | 'email' | 'role'>>;

@Injectable()
export class SessionService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  get repository() {
    return this.prisma.session;
  }

  async createAuthenticatedSession(
    user: UserSession,
    request: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id: sub, email, role } = user;

    const accessToken = await this.generateAccessToken({ sub, email, role });
    const refreshToken = await this.generateRefreshToken(user);
    await this.repository.create({
      data: {
        token: refreshToken,
        userId: sub,
        expiresAt: this.getExpiryDate(),
        device: request.headers['user-agent'],
        ip: request.ip,
      },
    });

    return { accessToken, refreshToken };
  }

  async findByRefreshToken(token: string): Promise<Session | null> {
    return this.repository.findUnique({ where: { token } });
  }

  async deleteSession(id: ID): Promise<void> {
    await this.repository.delete({ where: { id } });
  }

  async revokeSession(id: ID): Promise<void> {
    try {
      await this.repository.delete({ where: { id } });
      // TODO: block list subsequent calls
      return;
    } catch (error) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, this.refreshTokenOptions);
  }

  private getExpiryDate(): string {
    const timeInMs = ms(this.configService.get('JWT_REFRESH_TOKEN_DURATION'));
    return dayjs().add(timeInMs, 'milliseconds').toISOString();
  }

  generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  private generateRefreshToken(user: UserSession): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role } as JwtPayload,
      this.refreshTokenOptions,
    );
  }

  private get refreshTokenOptions(): JwtSignOptions {
    return {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_DURATION'),
    };
  }

  static getBearerToken(request: Request): string | undefined {
    const bearerToken = request.header('Authorization');

    if (bearerToken) {
      const match = bearerToken.trim().match(/^bearer\s(.+)$/i);
      if (match) {
        const [type, token] = match;
        if (type && token) {
          return token;
        }
      }
    }
  }
}
