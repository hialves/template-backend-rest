import { Role } from '@prisma/client';

export class CreateUserInput {
  email: string;
  password: string;
  role: Role;
}
