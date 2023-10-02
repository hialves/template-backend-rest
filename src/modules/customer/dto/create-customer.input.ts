import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { IsEmailNotRegistered } from '../../../common/validator/is-email-not-registered.validator';
import { HashPassword } from '../../../decorators/hash-password.decorator';

export class CreateCustomerInput {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsEmailNotRegistered()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @HashPassword()
  password: string;

  @IsOptional()
  @ApiPropertyOptional()
  cardToken?: string;

  @IsOptional()
  @ApiPropertyOptional()
  phone?: string;
}
