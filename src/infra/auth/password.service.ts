import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface PasswordService {
  hashPassword(password: string): Promise<string>;
  comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}

@Injectable()
export class PasswordService implements PasswordService {
  constructor(private saltRounds: number) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
