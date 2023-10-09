import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { AuthController } from '../../presentation/controllers/auth/auth.controller';

@Module({
  imports: [UserModule, SessionModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
