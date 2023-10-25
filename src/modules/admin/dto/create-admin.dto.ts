import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsEmailNotRegistered } from '../../../common/validator/is-email-not-registered.validator';
import { ApiProperty } from '@nestjs/swagger';
import { HashPassword } from '../../../common/decorators/hash-password.decorator';

export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsEmailNotRegistered()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @HashPassword()
  password: string;
}
