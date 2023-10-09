import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { CacheModule } from '../../../infra/config/cache/cache.module';
import { TwilioModule } from '../../../infra/config/twilio/twilio.module';

@Module({
  imports: [CacheModule, TwilioModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
