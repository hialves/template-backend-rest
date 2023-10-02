import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export function HashPassword() {
  return applyDecorators(Transform((params) => bcrypt.hashSync(params.value, 12)));
}
