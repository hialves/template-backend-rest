import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ID } from '../../@types';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Admin, Customer, Role } from '@prisma/client';
import { DeleteResult } from '../../common/responses/result-type';
import { PaginatedDto } from '../../common/dto/filter-input.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CustomerService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  private get repository() {
    return this.prisma.customer;
  }

  async create(input: CreateCustomerDto): Promise<Admin> {
    const { email, password } = input;
    const result = await this.prisma.$transaction(
      async (tx) => {
        const user = await this.userService.create({ email, password, role: Role.customer }, tx.user);
        return tx.admin.create({ data: { name: input.name, email, userId: user.id } });
      },
      { isolationLevel: 'ReadUncommitted' },
    );

    return result;
  }

  async findAll(filters?: PaginatedDto) {
    return this.repository.findMany(filters);
  }

  async findOne(id: ID) {
    return this.repository.findUnique({ where: { id } });
  }

  async update(id: ID, input: UpdateCustomerDto) {
    return this.repository.update({ where: { id }, data: input });
  }

  async remove(id: ID) {
    const result = await this.repository.delete({ where: { id } });
    return new DeleteResult(!!result);
  }

  getByUserId(userId: ID): Promise<Customer | null> {
    return this.repository.findUnique({ where: { userId } });
  }
}
