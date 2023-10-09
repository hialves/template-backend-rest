import { ApiProperty } from '@nestjs/swagger';
import { ID } from '../../../@types';
import { AdminModel } from '../../../domain/model/admin.model';

export class AdminPresenter {
  @ApiProperty()
  id: ID;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  assetId: ID;
  @ApiProperty()
  userId: ID;

  constructor(admin: AdminModel) {
    this.id = admin.id;
    this.createdAt = admin.createdAt;
    this.updatedAt = admin.updatedAt;
    this.name = admin.name;
    this.email = admin.email;
    this.assetId = admin.assetId;
    this.userId = admin.userId;
  }
}
