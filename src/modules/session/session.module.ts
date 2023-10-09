import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { CacheModule } from '../../infra/config/cache/cache.module';
import { DatabaseModule } from '../../infra/database/database.module';

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
