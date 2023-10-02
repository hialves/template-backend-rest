import { IsPublic } from '../../decorators/public.decorator';
import { CreateCustomerInput } from './dto/create-customer.input';
import { CustomerService } from './customer.service';
import { Roles } from '../../decorators/roles.decorator';
import { ID } from '../../@types';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { DeleteResult } from '../../common/responses/result-type';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginatedInput } from '../../common/dto/filter-input';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @IsPublic()
  @Post()
  createCustomer(@Body() input: CreateCustomerInput) {
    return this.service.create(input);
  }

  @Roles(Role.super_admin)
  @Get()
  findAll(@Query() query: PaginatedInput) {
    return this.service.findAll(query);
  }

  @Roles(Role.super_admin, Role.manager, Role.customer)
  @Get(':id')
  findOne(@Param('id') id: ID) {
    return this.service.findOne(id);
  }

  @Roles(Role.super_admin, Role.customer)
  @Patch(':id')
  update(@Param('id') id: ID, @Body() input: UpdateCustomerInput) {
    return this.service.update(id, input);
  }

  @Roles(Role.super_admin)
  @Delete(':id')
  remove(@Param('id') id: ID): Promise<DeleteResult> {
    return this.service.remove(id);
  }
}
