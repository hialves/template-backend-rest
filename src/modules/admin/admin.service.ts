import { Injectable } from '@nestjs/common';
import { CreateAdminInput } from './dto/create-admin.input';
import { ID } from '../../@types';
import { UserService } from '../user/user.service';
import { UpdateAdminInput } from './dto/update-admin.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Admin, Role } from '@prisma/client';
import { PaginatedInput } from '../../common/dto/filter-input';
import { DeleteResult } from '../../common/responses/result-type';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  private get repository() {
    return this.prisma.admin;
  }

  async create(input: CreateAdminInput): Promise<Admin> {
    const { email, password } = input;

    const result = await this.prisma.$transaction(
      async (tx) => {
        const user = await this.userService.create({ email, password, role: Role.admin }, tx.user);
        return tx.admin.create({ data: { name: input.name, userId: user.id } });
      },
      { isolationLevel: 'ReadUncommitted' },
    );

    return result;
  }

  async findAll(filters?: PaginatedInput) {
    return this.repository.findMany(filters);
  }

  findOne(id: ID) {
    return this.repository.findUnique({ where: { id } });
  }

  async update(id: ID, input: UpdateAdminInput) {
    await this.repository.update({ where: { id }, data: input });
    return this.findOne(id);
  }

  async remove(id: ID) {
    const result = await this.repository.delete({ where: { id } });
    return new DeleteResult(!!result);
  }

  getByUserId(userId: ID): Promise<Admin | null> {
    return this.repository.findUnique({ where: { userId } });
  }
}
