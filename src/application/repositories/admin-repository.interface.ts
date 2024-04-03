import { ID } from '../../domain/entities';
import { Admin } from '../../domain/entities/admin';
import { CreateAdminData } from '../../domain/valueobjects/create-admin-data';

export abstract class AdminRepository {
  abstract create(input: CreateAdminData): Promise<Admin>;
  abstract exists(id: ID): Promise<boolean>;
  abstract findById(id: ID): Promise<Admin | null>;
  abstract findByEmail(email: string): Promise<Admin | null>;
  abstract update(input: Admin): Promise<Admin>;
  abstract getByUserId(userId: ID): Promise<Admin | null>;
}
