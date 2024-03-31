import { ID } from '../../@types';
import { Customer } from '../../domain/entities/customer';
import { User } from '../../domain/entities/user';

export abstract class CustomerRepository {
  abstract create(admin: Customer, user: User): Promise<Customer>;
  abstract exists(id: ID): Promise<boolean>;
  abstract findById(id: ID): Promise<Customer | null>;
  abstract findByEmail(email: string): Promise<Customer | null>;
  abstract update(input: Customer): Promise<Customer>;
  abstract getByUserId(userId: ID): Promise<Customer | null>;
}
