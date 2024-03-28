import { Role } from '@prisma/client';
import dayjs from 'dayjs';
import { ID } from '../../@types';
import { nullCoalesce } from '../helpers/null-coalesce';

interface UserFields {
  id?: ID;
  createdAt?: Date;
  updatedAt?: Date;
  password: string | null;
  email: string;
  recoverPasswordToken?: string | null;
  recoverPasswordTokenExpire?: Date | null;
  googleToken?: string | null;
  role: Role | null;
  lastLogin?: Date | null;
}

export class User {
  id?: ID;
  createdAt: Date;
  updatedAt: Date;
  password: string | null;
  email: string;
  recoverPasswordToken: string | null;
  recoverPasswordTokenExpire: Date | null;
  googleToken: string | null;
  role: Role | null;
  lastLogin: Date | null;

  constructor(input: UserFields) {
    this.id = input.id;
    this.createdAt = input.createdAt || dayjs().toDate();
    this.updatedAt = input.updatedAt || dayjs().toDate();
    this.password = input.password;
    this.email = input.email;
    this.recoverPasswordToken = nullCoalesce(input.recoverPasswordToken);
    this.recoverPasswordTokenExpire = nullCoalesce(input.recoverPasswordTokenExpire);
    this.googleToken = nullCoalesce(input.googleToken);
    this.role = input.role;
    this.lastLogin = nullCoalesce(input.lastLogin);
  }

  setLastLogin() {
    this.lastLogin = dayjs().toDate();
    return this;
  }

  setRecoverPasswordData(token: string) {
    this.recoverPasswordToken = token;
    this.recoverPasswordTokenExpire = dayjs().add(30, 'minute').toDate();
    return this;
  }

  resetPassword(passwordHash: string) {
    this.password = passwordHash;
    this.recoverPasswordToken = null;
    this.recoverPasswordTokenExpire = null;
  }
}
