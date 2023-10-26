import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { CacheModule } from '../../shared/cache/cache.module';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
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
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
