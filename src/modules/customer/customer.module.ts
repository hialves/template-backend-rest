import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthModule } from '../auth/auth.module';
import { CustomerController } from '../../presentation/controllers/customer/customer.controller';
import { DatabaseModule } from '../../infra/database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
