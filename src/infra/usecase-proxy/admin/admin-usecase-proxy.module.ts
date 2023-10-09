import { DynamicModule, Module } from '@nestjs/common';
import { AdminRepository } from '../../repositories/admin.repository';
import { AdminService } from '../../../application/services/admin/admin.service';
import { RepositoryModule } from '../../repositories/repository.module';

@Module({
  imports: [RepositoryModule],
})
export class AdminUseCaseProxyModule {
  static ADMIN_SERVICE_PROXY = 'adminServiceProxy';

  static register(): DynamicModule {
    return {
      module: AdminUseCaseProxyModule,
      providers: [
        {
          inject: [AdminRepository],
          provide: AdminUseCaseProxyModule.ADMIN_SERVICE_PROXY,
          useFactory: (adminRepository: AdminRepository) => {
            return new AdminService(adminRepository);
          },
        },
      ],
      exports: [AdminUseCaseProxyModule.ADMIN_SERVICE_PROXY],
    };
  }
}
