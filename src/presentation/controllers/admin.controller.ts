import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from '../dto/admin/create-admin.dto';
import { PrismaService } from '../../infra/persistence/prisma/prisma.service';
import { Role } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { PaginatedDto } from '../dto/list/filter-input.dto';
import { ID } from '../../domain/entities';
import { UpdateAdminDto } from '../dto/admin/update-admin.dto';
import { UpdateAdminData } from '../../domain/valueobjects/update-admin-data';
import { AdminService } from '../../application/services/admin/admin.service';
import { IsPublic } from '../decorators/public.decorator';
import { CreateAdminData } from '../../domain/valueobjects/create-admin-data';

@ApiTags('Admin')
@Controller('admins')
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
  create(@Body() dto: CreateAdminDto) {
    const { email, name, password } = dto;
    const input = new CreateAdminData({ email, name, password, role: Role.admin });
    return this.service.create(input);
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
  update(@Param('id') id: ID, @Body() dto: UpdateAdminDto) {
    const data = new UpdateAdminData(dto);
    return this.service.update(id, data);
  }

  @Roles(Role.super_admin)
  @Delete(':id')
  async remove(@Param('id') id: ID) {
    await this.repository.delete({ where: { id } });
  }
}
