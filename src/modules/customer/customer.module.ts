import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthModule } from '../auth/auth.module';
import { CustomerController } from './customer.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
