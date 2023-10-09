import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ID } from '../../@types';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { Customer, Role } from '@prisma/client';
import { DeleteResult } from '../../common/responses/result-type';
import { PaginatedDto } from '../../common/dto/filter-input.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  private get repository() {
    return this.prisma.customer;
  }

  async create(input: CreateCustomerDto) {
    const { email, password, ...customerData } = input;

    return this.repository.create({
      data: { ...customerData, email, user: { create: { email, password, role: Role.customer } } },
    });
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
