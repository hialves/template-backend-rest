import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth/auth.service';
import { UserModule } from './user.module';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { PasswordService } from '../auth/password.service';
import { CacheModule } from '../frameworks/cache/cache.module';
import { SessionService } from '../auth/session.service';

@Module({
  imports: [
    UserModule,
    CacheModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
          global: false,
          signOptions: { expiresIn: configService.get('JWT_ACCESS_TOKEN_DURATION') },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    PasswordService,
    SessionService,
    { provide: PasswordService, useValue: new PasswordService(12) },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
