import { HttpStatus } from '@nestjs/common';
import { ID } from '../../../@types';
import { Admin, AdminFields } from '../../../domain/entities/admin';
import { User } from '../../../domain/entities/user';
import { UpdateAdminData } from '../../../domain/valueobjects/update-admin-data';
import { ApplicationError } from '../../errors/application-error';
import { PasswordService } from '../../interfaces/password-service.interface';
import { responseMessages } from '../../messages/response.messages';
import { AdminRepository } from '../../repositories/admin-repository.interface';

export class AdminService {
  constructor(
    private repository: AdminRepository,
    private passwordService: PasswordService,
  ) {}

  async create(admin: Admin, user: User) {
    if (user.password) user.password = await this.passwordService.hashPassword(user.password);
    return this.repository.create(admin, user);
  }

  async update(id: ID, updateData: UpdateAdminData): Promise<Admin | ApplicationError> {
    const existsAdmin = await this.repository.findById(id);
    if (!existsAdmin)
      return new ApplicationError(
        responseMessages.notFound(responseMessages.admin.entity),
        undefined,
        HttpStatus.NOT_FOUND,
      );

    const adminFields: AdminFields = {
      ...existsAdmin,
      email: updateData.email || existsAdmin.email,
      name: updateData.name || existsAdmin.name,
    };
    const admin = new Admin(adminFields);

    return this.repository.update(admin);
  }
}
