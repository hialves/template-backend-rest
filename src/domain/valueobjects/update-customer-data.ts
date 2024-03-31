import { ID } from '../../@types';
import { Customer } from '../entities/customer';

export class UpdateCustomerData {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  email?: string;
  cardToken?: string | null;
  phone?: string | null;
  assetId?: ID | null;
  userId?: ID | null;

  constructor(public data: Partial<Customer>) {}
}
