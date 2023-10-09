import { ID } from '../../@types';
import { PaginatedDto } from '../../common/dto/filter-input.dto';
import { ICreateAdminDto } from '../dto/admin-dto.interface';
import { AdminModel } from '../model/admin.model';

export interface IAdminRepository {
  create(dto: ICreateAdminDto): Promise<AdminModel>;
  findOne(id: ID): Promise<AdminModel | null>;
  findOneBy(key: keyof AdminModel, value: any, isUnique?: boolean): Promise<AdminModel | null>;
  findMany(filters?: PaginatedDto): Promise<AdminModel[]>;
  update(id: ID, dto: Partial<AdminModel>): Promise<AdminModel>;
  delete(id: ID): Promise<void>;
  count(filters?: { where?: Record<string, any> }): Promise<number>;
}
