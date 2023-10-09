import { Module } from '@nestjs/common';
import { EmailNotRegistered } from '../../infra/validator/is-email-not-registered.validator';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { ProfileService } from './profile.service';
import { ProfileController } from '../../presentation/controllers/profile/profile.controller';

@Module({
  imports: [UserModule, CustomerModule],
  providers: [ProfileService, EmailNotRegistered],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
