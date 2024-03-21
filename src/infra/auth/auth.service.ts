import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import dayjs from 'dayjs';

import { UserService } from '../../modules/user/user.service';
import { InvalidCredentialsError, NotFoundError } from '../../presentation/responses/result-type';
import { responseMessages } from '../../application/messages/response.messages';
import { LoginDto } from '../../presentation/dto/login.dto';
import { SessionService } from './session.service';
import { apiConfig } from '../../config/api.config';
import { Request, Response } from 'express';
import { MailService } from '../../application/interfaces/mail-service.interface';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private userService: UserService,
    private sessionService: SessionService,
  ) {}

  async sendRecoverPasswordEmail(email: string) {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const token = crypto.createHash('sha256').update(resetToken).digest('hex');
    let user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundError(responseMessages.notFound(responseMessages.user.entity), email);
    await this.userService.setRecoverPasswordData(user.id, token);

    await this.mailService.sendMail({
      to: email,
      subject: 'Recuperação de senha',
      html: `
        <html>
          <body>
            <a href="${process.env.FRONT_END_DOMAIN}/recover-password?token=${token}">Recuperar senha</span>
            <br>
            <a href="${process.env.FRONT_END_DOMAIN}/recover-password?token=${token}">${process.env.FRONT_END_DOMAIN}/recover-password/${token}</span>
          </body>
        </html>`,
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.findByRecoverPasswordToken(token);
    if (!user) return;

    if (user.recoverPasswordTokenExpire && dayjs().isAfter(dayjs(user.recoverPasswordTokenExpire))) {
      throw new BadRequestException(responseMessages.auth.invalidCodeOrExpired);
    }

    await this.userService.resetPassword(user.id, newPassword);
  }

  // TODO: remover request e response
  async login(input: LoginDto, request: Request, response: Response) {
    const user = await this.userService.findByEmailLogin(input.email);
    if (!user || !user.password) throw new InvalidCredentialsError();
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) throw new InvalidCredentialsError();

    const tokens = await this.sessionService.createAuthenticatedSession(user, request);
    const { accessTokenHeaderKey } = apiConfig;
    response.header(accessTokenHeaderKey, tokens.accessToken);
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const payload = await this.sessionService.verifyRefreshToken(refreshToken);
      return this.sessionService.generateAccessToken(payload);
    } catch (error) {
      throw new UnauthorizedException(responseMessages.auth.unauthorized);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    const session = await this.sessionService.findByRefreshToken(refreshToken);
    if (session) return this.sessionService.deleteSession(session.id);
  }
}
