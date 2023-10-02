import { Module } from '@nestjs/common';
import { EmailNotRegistered } from '../../common/validator/is-email-not-registered.validator';
import { AdminModule } from '../admin/admin.module';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UserModule, AdminModule, CustomerModule],
  providers: [ProfileService, EmailNotRegistered],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
