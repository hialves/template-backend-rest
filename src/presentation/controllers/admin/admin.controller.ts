import { Roles } from '../../../infra/decorators/roles.decorator';
import { CreateAdminDto, UpdateAdminDto } from './admin.dto';
import { ID } from '../../../@types';
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaginatedDto } from '../../../common/dto/filter-input.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminUseCaseProxyModule } from '../../../infra/usecase-proxy/admin/admin-usecase-proxy.module';
import { AdminService } from '../../../application/services/admin/admin.service';
import { IsPublic } from '../../../infra/decorators/public.decorator';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(@Inject(AdminUseCaseProxyModule.ADMIN_SERVICE_PROXY) private readonly service: AdminService) {}

  @Roles(Role.super_admin)
  @Post()
  create(@Body() input: CreateAdminDto) {
    return this.service.create(input);
  }

  @Roles(Role.super_admin)
  @IsPublic()
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
