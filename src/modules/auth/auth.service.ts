import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import dayjs from 'dayjs';

import { MailService } from '../../mail/mail.service';
import { UserService } from '../user/user.service';
import { InvalidCredentialsError, NotFoundError, SuccessResult } from '../../common/responses/result-type';
import { responseMessages } from '../../common/messages/response.messages';
import { LoginDto } from './dto/login.dto';
import { SessionService } from '../session/session.service';
import { apiConfig } from '../../config/api.config';
import { Request, Response } from 'express';
import { IUserSession } from '../../common/interfaces/session.interface';

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
      // TODO
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
    let user = await this.userService.findByRecoverPasswordToken(token);

    if (user.recoverPasswordTokenExpire && dayjs().isAfter(dayjs(user.recoverPasswordTokenExpire))) {
      throw new BadRequestException(responseMessages.auth.invalidCodeOrExpired);
    }

    await this.userService.resetPassword(user.id, newPassword);
  }

  async login(input: LoginDto, request: Request, response: Response) {
    const user = await this.userService.findByEmailLogin(input.email);
    if (!user) throw new InvalidCredentialsError();
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) throw new InvalidCredentialsError();

    const accessToken = await this.sessionService.createAuthenticatedSession(user, request);
    const { accessTokenHeaderKey } = apiConfig;
    response.header(accessTokenHeaderKey, accessToken);

    return new SuccessResult(responseMessages.auth.loginSuccess);
  }

  async logout(session: IUserSession): Promise<void> {
    return this.sessionService.deleteSession(session);
  }
}
