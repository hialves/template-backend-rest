import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailNotRegistered } from '../../common/validator/is-email-not-registered.validator';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService, EmailNotRegistered],
  exports: [UserService],
})
export class UserModule {}
