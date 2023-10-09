import { RoleEnum } from '../enums/role.enum';

export class UserModel {
  id?: string;
  createdAt: string;
  updatedAt?: string;
  password: string;
  email: string;
  recoverPasswordToken?: string;
  recoverPasswordTokenExpire?: string;
  googleToken?: string;
  role?: RoleEnum;
  lastLogin?: string;
}
