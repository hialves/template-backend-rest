import dayjs from 'dayjs';
import { nullCoalesce } from '../helpers/null-coalesce';
import { ID } from '../../@types';

export interface CustomerFields {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  email: string;
  cardToken?: string | null;
  phone?: string | null;
  assetId?: ID | null;
  userId?: ID | null;
}

export class Customer {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  cardToken: string | null;
  phone: string | null;
  assetId: ID | null;
  userId: ID | null;

  constructor(input: CustomerFields) {
    this.id = input.id;
    this.createdAt = input.createdAt || dayjs().toDate();
    this.updatedAt = input.updatedAt || dayjs().toDate();
    this.name = input.name;
    this.email = input.email;
    this.cardToken = nullCoalesce(this.cardToken);
    this.phone = nullCoalesce(this.phone);
    this.assetId = nullCoalesce(this.assetId);
    this.userId = nullCoalesce(this.userId);
  }
}
