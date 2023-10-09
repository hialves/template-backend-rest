import { Admin, Role } from '@prisma/client';
import { ID } from '../../@types';
import { PaginatedDto } from '../../common/dto/filter-input.dto';
import { AdminModel } from '../../domain/model/admin.model';
import { IAdminRepository } from '../../domain/repositories/admin-repository.interface';
import { PrismaService } from '../database/prisma/prisma.service';
import { CreateAdminDto } from '../../presentation/controllers/admin/admin.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(private prisma: PrismaService) {}

  private get repository() {
    return this.prisma.admin;
  }

  async create(dto: CreateAdminDto): Promise<AdminModel> {
    const { email, password, ...adminData } = dto;

    return this.repository.create({
      data: { ...adminData, email, user: { create: { email, password, role: Role.admin } } },
    });
  }
  findOne(id: ID): Promise<AdminModel | null> {
    return this.repository.findUnique({ where: { id } });
  }
  findOneBy(key: keyof AdminModel, value: any, isUnique: boolean = false): Promise<AdminModel> {
    if (isUnique) {
      return this.repository.findUnique({ where: { [key as 'id']: value } });
    }

    return this.repository.findFirst({ where: { [key]: value } });
  }
  async findMany(filters?: PaginatedDto): Promise<AdminModel[]> {
    return this.repository.findMany(filters);
  }
  update(id: ID, admin: Partial<AdminModel>): Promise<AdminModel> {
    return this.repository.update({ where: { id }, data: admin });
  }
  async delete(id: ID): Promise<void> {
    await this.repository.delete({ where: { id } });
  }
  count(filters: { where: Record<string, any> }) {
    return this.repository.count(filters);
  }

  private toAdmin(adminEntity: Admin): AdminModel {
    const admin = new AdminModel();

    adminEntity.id = admin.id;
    adminEntity.createdAt = admin.createdAt;
    adminEntity.updatedAt = admin.updatedAt;
    adminEntity.name = admin.name;
    adminEntity.assetId = admin.assetId;
    adminEntity.userId = admin.userId;

    return admin;
  }
}
