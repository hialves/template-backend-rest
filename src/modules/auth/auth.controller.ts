import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { Request, Response } from 'express';
import { IsPublic } from '../../decorators/public.decorator';
import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @IsPublic()
  @Post('login')
  login(@Body() input: LoginInput, @Req() req: Request, @Res() res: Response) {
    return this.service.login(input, req, res);
  }

  @IsPublic()
  @Post('logout')
  logout(@Req() req: Request): Promise<void> {
    return this.service.logout(req.session);
  }

  @IsPublic()
  @Post('send-recover-password')
  sendRecoverPassword(@Body() body: { email: string }) {
    return this.service.sendRecoverPasswordEmail(body.email);
  }

  @IsPublic()
  @Post('recover-password')
  recoverPassword(@Query('token') token: string, @Body() body: { password: string }) {
    return this.service.resetPassword(token, body.password);
  }
}
