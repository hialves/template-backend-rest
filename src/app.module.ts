import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './modules/admin/admin.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AuthModule } from './infra/modules/auth.module';
import { NodeMailerModule } from './infra/frameworks/mail/nodemailer.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './infra/security/guards/auth.guard';
import { CacheModule } from './infra/frameworks/cache/cache.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AssetModule } from './modules/asset/asset.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { RolesGuard } from './infra/security/guards/roles.guard';
import { LoggingInterceptor } from './presentation/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register(),
    AdminModule,
    AuthModule,
    CustomerModule,
    NodeMailerModule,
    UserModule,
    CacheModule,
    ProfileModule,
    AssetModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
