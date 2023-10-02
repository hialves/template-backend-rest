import { Injectable } from '@nestjs/common';
import { ID } from '../../@types';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
import { CustomerService } from '../customer/customer.service';
import { NotFoundError } from '../../common/responses/result-type';
import { responseMessages } from '../../common/messages/response.messages';
import { Role } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private customerService: CustomerService,
  ) {}

  async getProfile(userId: ID) {
    const user = await this.userService.findOne(userId);
    if (user.role && user.role !== Role.customer) {
      const admin = await this.adminService.getByUserId(userId);
      return { ...admin, user };
    }

    if (user.role === Role.customer) {
      const customer = await this.customerService.getByUserId(userId);
      return { ...customer, user };
    }

    throw new NotFoundError(responseMessages.notFound(responseMessages.user.entity));
  }
}
