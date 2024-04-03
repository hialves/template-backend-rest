import { CreateCustomerDto } from '../dto/customer/create-customer.dto';
import { CustomerService } from '../../application/services/customer/customer.service';
import { ID } from '../../@types';
import { UpdateCustomerDto } from '../dto/customer/update-customer.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { IsPublic } from '../decorators/public.decorator';
import { UpdateCustomerData } from '../../domain/valueobjects/update-customer-data';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { CreateCustomerData } from '../../domain/valueobjects/create-customer-data';

@ApiTags('Customer')
@Controller('customers')
export class CustomerController {
  constructor(
    private service: CustomerService,
    private prisma: PrismaService,
  ) {}

  private get repository() {
    return this.prisma.admin;
  }

  @IsPublic()
  @Post()
  createCustomer(@Body() dto: CreateCustomerDto) {
    const { email, name, phone, password } = dto;
    const input = new CreateCustomerData({ name, email, password, phone, role: Role.customer });
    return this.service.create(input);
  }

  @Roles(Role.super_admin)
  @Get()
  findAll(@Query() filters: PaginatedDto) {
    return this.repository.findMany(filters);
  }

  @Roles(Role.super_admin, Role.manager, Role.customer)
  @Get(':id')
  findOne(@Param('id') id: ID) {
    return this.repository.findUnique({ where: { id } });
  }

  @Roles(Role.super_admin, Role.customer)
  @Patch(':id')
  update(@Param('id') id: ID, @Body() dto: UpdateCustomerDto) {
    const data = new UpdateCustomerData(dto);
    return this.service.update(id, data);
  }

  @Roles(Role.super_admin)
  @Delete(':id')
  async remove(@Param('id') id: ID) {
    await this.repository.delete({ where: { id } });
  }
}
