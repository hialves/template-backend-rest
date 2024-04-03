import { ID } from '../../@types';
import { User } from '../../domain/entities/user';

export abstract class UserRepository {
  abstract exists(id: ID): Promise<boolean>;
  abstract findById(id: ID): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByRecoverPasswordToken(recoverPasswordToken: string): Promise<User | null>;
  abstract update(input: User): Promise<User>;
}
