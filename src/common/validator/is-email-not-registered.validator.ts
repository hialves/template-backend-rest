import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { responseMessages } from '../messages/response.messages';

@ValidatorConstraint({ async: true })
@Injectable()
export class EmailNotRegistered implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user) throw new ConflictException('email');
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return validationArguments?.constraints[0] || responseMessages.user.emailConflictError;
  }
}

export function IsEmailNotRegistered(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailNotRegistered,
    });
  };
}
