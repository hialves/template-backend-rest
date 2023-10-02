import { validate } from 'class-validator';
import { ValidationError } from '../responses/result-type';

export class CommonValidator {
  static async simpleValidate(input: object) {
    const errors = await validate(input);
    if (errors.length) return new ValidationError(errors);

    return null;
  }
}
