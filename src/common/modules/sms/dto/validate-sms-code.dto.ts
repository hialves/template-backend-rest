import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { responseMessages } from '../../../messages/response.messages';

export enum ValidateSmsCodeEnum {
  LOGIN = 'LOGIN',
}

export class ValidateSmsCodeDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber(undefined, {
    message: responseMessages.invalidPhone,
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  validateFor: ValidateSmsCodeEnum;
}
