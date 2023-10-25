import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { CacheModule } from '../../../shared/cache/cache.module';
import { TwilioModule } from '../../../shared/twilio/twilio.module';

@Module({
  imports: [CacheModule, TwilioModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
