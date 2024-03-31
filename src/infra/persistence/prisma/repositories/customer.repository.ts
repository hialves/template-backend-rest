import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ID } from '../../../../@types';
import { User } from '../../../../domain/entities/user';
import { Customer as PrismaCustomer } from '@prisma/client';
import { Customer } from '../../../../domain/entities/customer';
import { CustomerRepository } from '../../../../application/repositories/customer-repository.interface';

function toDomain(result: PrismaCustomer | null): Customer | null {
  if (result) return new Customer(result);
  return null;
}

@Injectable()
export class CustomerPrismaRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.customer;
  }

  async create(customer: Customer, user: User) {
    const result = await this.prisma.$transaction(
      async (tx) => {
        const createdUser = await tx.user.create({ data: user });
        customer.userId = createdUser.id;
        return tx.customer.create({ data: customer });
      },
      { isolationLevel: 'ReadUncommitted' },
    );

    return new Customer(result);
  }

  async findById(id: ID): Promise<Customer | null> {
    const result = await this.repository.findUnique({
      where: { id },
    });
    return toDomain(result);
  }

  async findByEmail(email: string) {
    const result = await this.repository.findFirst({
      where: { email },
    });
    return toDomain(result);
  }

  async exists(id: ID): Promise<boolean> {
    const result = await this.repository.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!result;
  }

  async update(input: Customer): Promise<Customer> {
    return new Customer(await this.repository.update({ where: { id: input.id }, data: input }));
  }

  async getByUserId(userId: ID): Promise<Customer | null> {
    const result = await this.repository.findUnique({
      where: { userId },
    });
    return toDomain(result);
  }
}
