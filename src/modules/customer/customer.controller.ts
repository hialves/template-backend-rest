import { IsPublic } from '../../common/decorators/public.decorator';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerService } from './customer.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { ID } from '../../@types';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { DeleteResult } from '../../common/responses/result-type';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginatedDto } from '../../common/dto/filter-input.dto';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customer')
@Controller('customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @IsPublic()
  @Post()
  createCustomer(@Body() input: CreateCustomerDto) {
    return this.service.create(input);
  }

  @Roles(Role.super_admin)
  @Get()
  findAll(@Query() query: PaginatedDto) {
    return this.service.findAll(query);
  }

  @Roles(Role.super_admin, Role.manager, Role.customer)
  @Get(':id')
  findOne(@Param('id') id: ID) {
    return this.service.findOne(id);
  }

  @Roles(Role.super_admin, Role.customer)
  @Patch(':id')
  update(@Param('id') id: ID, @Body() input: UpdateCustomerDto) {
    return this.service.update(id, input);
  }

  @Roles(Role.super_admin)
  @Delete(':id')
  remove(@Param('id') id: ID): Promise<DeleteResult> {
    return this.service.remove(id);
  }
}
