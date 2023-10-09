import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailNotRegistered } from '../../infra/validator/is-email-not-registered.validator';
import { DatabaseModule } from '../../infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, EmailNotRegistered],
  exports: [UserService],
})
export class UserModule {}
