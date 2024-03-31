import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from '../dto/admin/create-admin.dto';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { Role } from '@prisma/client';
import { User } from '../../domain/entities/user';
import { Roles } from '../decorators/roles.decorator';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { ID } from '../../@types';
import { UpdateAdminDto } from '../dto/admin/update-admin.dto';
import { UpdateAdminData } from '../../domain/valueobjects/update-admin-data';
import { AdminService } from '../../application/services/admin/admin.service';
import { Admin } from '../../domain/entities/admin';
import { IsPublic } from '../decorators/public.decorator';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private service: AdminService,
  ) {}

  private get repository() {
    return this.prisma.admin;
  }

  @IsPublic()
  @Post()
  create(@Body() input: CreateAdminDto) {
    const { email, name, password } = input;
    const admin = new Admin({ email, name });
    const user = new User({ email, password, role: Role.admin });
    return this.service.create(admin, user);
  }

  @Roles(Role.super_admin)
  @Get()
  async findAll(@Query() filters?: PaginatedDto) {
    return this.repository.findMany(filters);
  }

  @Roles(Role.super_admin)
  @Get(':id')
  findOne(@Param('id') id: ID) {
    return this.repository.findUnique({ where: { id } });
  }

  @Roles(Role.super_admin, Role.admin, Role.manager)
  @Patch(':id')
  update(@Param('id') id: ID, @Body() input: UpdateAdminDto) {
    const data = new UpdateAdminData(input);
    return this.service.update(id, data);
  }

  @Roles(Role.super_admin)
  @Delete(':id')
  async remove(@Param('id') id: ID) {
    await this.repository.delete({ where: { id } });
  }
}
