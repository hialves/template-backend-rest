import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AdminRepository } from './admin.repository';

@Module({
  imports: [DatabaseModule],
  providers: [AdminRepository],
  exports: [AdminRepository],
})
export class RepositoryModule {}
