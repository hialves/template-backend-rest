import { Role } from '@prisma/client';
import { ID } from '../../@types';

export interface ILoginUser {
  id: ID;
  email: string;
  password?: string;
  role?: Role;
}
