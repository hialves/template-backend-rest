import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { CacheModule } from '../../connections/cache/cache.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, CacheModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
