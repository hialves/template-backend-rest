import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { CacheModule } from '../../shared/cache/cache.module';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
