import { ID } from '.';

export interface CustomerFields {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phone: string | null;
  assetId: ID | null;
  userId: ID | null;
}

export class Customer implements CustomerFields {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phone: string | null;
  assetId: ID | null;
  userId: ID | null;

  constructor(input: CustomerFields) {
    this.id = input.id;
    this.createdAt = input.createdAt;
    this.updatedAt = input.updatedAt;
    this.name = input.name;
    this.email = input.email;
    this.phone = input.phone;
    this.assetId = input.assetId;
    this.userId = input.userId;
  }
}
