import { Role } from '@prisma/client';
import { ID } from '../../@types';

export interface UserSession {
  userId: ID;
  email: string;
  role: Role | null;
}
