import dayjs from 'dayjs';
import { nullCoalesce } from '../helpers/null-coalesce';
import { ID } from '../../@types';

export interface AdminFields {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  email: string;
  assetId?: ID | null;
  userId?: ID | null;
}

export class Admin {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  assetId: ID | null;
  userId: ID | null;

  constructor(input: AdminFields) {
    this.id = input.id;
    this.createdAt = input.createdAt || dayjs().toDate();
    this.updatedAt = input.updatedAt || dayjs().toDate();
    this.name = input.name;
    this.email = input.email;
    this.assetId = nullCoalesce(this.assetId);
    this.userId = nullCoalesce(this.userId);
  }
}
