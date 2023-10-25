import { Module } from '@nestjs/common';
import { GenerateCodeService } from './generate-code.service';
import { CacheModule } from '../../../shared/cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [GenerateCodeService],
  exports: [GenerateCodeService],
})
export class GenerateCodeModule {}
