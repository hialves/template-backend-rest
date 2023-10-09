import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminUseCaseProxyModule } from '../../../infra/usecase-proxy/admin/admin-usecase-proxy.module';
import { AdminRepository } from '../../../infra/repositories/admin.repository';
import { AdminService } from '../../../application/services/admin/admin.service';
import { RepositoryModule } from '../../../infra/repositories/repository.module';

@Module({
  imports: [AdminUseCaseProxyModule.register()],
  controllers: [AdminController],
})
export class AdminModule {}
