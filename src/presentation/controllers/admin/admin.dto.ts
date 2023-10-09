import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsEmailNotRegistered } from '../../../infra/validator/is-email-not-registered.validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { HashPassword } from '../../../infra/decorators/hash-password.decorator';
import { ICreateAdminDto, IUpdateAdminDto } from '../../../domain/dto/admin-dto.interface';

export class CreateAdminDto implements ICreateAdminDto {
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

export class UpdateAdminDto extends PartialType(CreateAdminDto) implements IUpdateAdminDto {}
