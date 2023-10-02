import { Roles } from '../../decorators/roles.decorator';
import { AdminService } from './admin.service';
import { CreateAdminInput } from './dto/create-admin.input';
import { UpdateAdminInput } from './dto/update-admin.input';
import { ID } from '../../@types';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaginatedInput } from '../../common/dto/filter-input';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../../decorators/public.decorator';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  // @Roles(Role.super_admin)
  @IsPublic()
  @Post()
  create(@Body() input: CreateAdminInput) {
    console.log({ input });
    return this.service.create(input);
  }

  @Roles(Role.super_admin)
  @Get()
  findAll(@Query() query: PaginatedInput) {
    return this.service.findAll(query);
  }

  @Roles(Role.super_admin)
  @Get(':id')
  findOne(@Param('id') id: ID) {
    return this.service.findOne(id);
  }

  @Roles(Role.super_admin, Role.admin, Role.manager)
  @Patch(':id')
  update(@Param('id') id: ID, @Body() input: UpdateAdminInput) {
    return this.service.update(id, input);
  }

  @Roles(Role.super_admin)
  @Delete(':id')
  remove(@Param('id') id: ID) {
    return this.service.remove(id);
  }
}
