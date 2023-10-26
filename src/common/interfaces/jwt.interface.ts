import { Role } from '@prisma/client';
import { ID } from '../../@types';

export interface JwtPayload {
  sub: ID;
  email: string;
  role: Role;
}
