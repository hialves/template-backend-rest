import { ID } from '../../@types';

export class AdminModel {
  id: ID;
  createdAt: Date;
  updatedAt?: Date;
  name: string;
  email: string;
  assetId?: ID;
  userId?: ID;
}
