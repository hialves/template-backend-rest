import { ID } from '../../@types';
import { Admin } from '../entities/admin';

export class UpdateAdminData {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  email?: string;
  assetId?: ID | null;
  userId?: ID | null;

  constructor(public data: Partial<Admin>) {}
}
