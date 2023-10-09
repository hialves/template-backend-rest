import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../infra/config/cache/cache.service';
import { responseMessages } from '../../messages/response.messages';
import { TwilioService } from '../../../infra/config/twilio/twilio.service';
import { isPhoneNumber } from 'class-validator';
import { MessageListInstance } from 'twilio/lib/rest/api/v2010/account/message';

@Injectable()
export class SmsService {
  twilioSms: MessageListInstance;
  constructor(private twilioService: TwilioService) {
    this.twilioSms = this.twilioService.customer.messages;
  }

  async send(body: string, phone: string) {
    if (!isPhoneNumber(phone)) throw new Error(responseMessages.invalidPhone);

    return this.twilioSms.create({
      body,
      to: phone,
      from: process.env.PHONE_FROM,
      attempt: 3,
    });
  }
}
