import { ID } from '../../@types';
import { Admin } from '../../domain/entities/admin';
import { User } from '../../domain/entities/user';

export abstract class AdminRepository {
  abstract create(admin: Admin, user: User): Promise<Admin>;
  abstract exists(id: ID): Promise<boolean>;
  abstract findById(id: ID): Promise<Admin | null>;
  abstract findByEmail(email: string): Promise<Admin | null>;
  abstract update(input: Admin): Promise<Admin>;
  abstract getByUserId(userId: ID): Promise<Admin | null>;
}
