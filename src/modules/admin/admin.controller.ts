import { Roles } from '../../decorators/roles.decorator';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ID } from '../../@types';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaginatedDto } from '../../common/dto/filter-input.dto';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../../decorators/public.decorator';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  // @Roles(Role.super_admin)
  @IsPublic()
  @Post()
  create(@Body() input: CreateAdminDto) {
    console.log({ input });
    return this.service.create(input);
  }

  @Roles(Role.super_admin)
  @Get()
  findAll(@Query() query: PaginatedDto) {
    return this.service.findAll(query);
  }

  @Roles(Role.super_admin)
  @Get(':id')
  findOne(@Param('id') id: ID) {
    return this.service.findOne(id);
  }

  @Roles(Role.super_admin, Role.admin, Role.manager)
  @Patch(':id')
  update(@Param('id') id: ID, @Body() input: UpdateAdminDto) {
    return this.service.update(id, input);
  }

  @Roles(Role.super_admin)
  @Delete(':id')
  remove(@Param('id') id: ID) {
    return this.service.remove(id);
  }
}
