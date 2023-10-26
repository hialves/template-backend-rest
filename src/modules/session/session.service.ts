import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import dayjs from 'dayjs';
import ms from 'ms';
import { Request } from 'express';
import { Session, User } from '@prisma/client';

import { PrismaService } from '../../shared/prisma/prisma.service';
import { JwtPayload } from '../../common/interfaces/jwt.interface';
import { ID } from '../../@types';

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

  async createAuthenticatedSession(user: User, request: Request) {
    const { id: sub, ...rest } = user;
    const accessToken = await this.generateAccessToken({ sub, ...rest });
    const refreshToken = await this.generateRefreshToken(user);
    await this.repository.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: this.getExpiryDate(),
        device: request.headers['user-agent'],
        ip: request.ip,
      },
    });

    return { accessToken, refreshToken };
  }

  async findByRefreshToken(token: string): Promise<Session> {
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

  private generateRefreshToken(user: User): Promise<string> {
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
      const [type, token] = bearerToken.trim().match(/^bearer\s(.+)$/i);
      if (type && token) {
        return token;
      }
    }
  }
}
