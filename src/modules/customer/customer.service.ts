import { Injectable } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { ID } from '../../@types';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { PrismaService } from '../../prisma/prisma.service';
import { Customer } from '@prisma/client';
import { DeleteResult } from '../../common/responses/result-type';
import { PaginatedInput } from '../../common/dto/filter-input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  private get repository() {
    return this.prisma.customer;
  }

  async create(input: CreateCustomerInput) {
    return this.repository.create({ data: input });
  }

  async findAll(filters?: PaginatedInput) {
    return this.repository.findMany(filters);
  }

  async findOne(id: ID) {
    return this.repository.findUnique({ where: { id } });
  }

  async update(id: ID, input: UpdateCustomerInput) {
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
