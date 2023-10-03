import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ID } from '../../@types';
import { DeleteResult, NotFoundError } from '../../common/responses/result-type';
import { responseMessages } from '../../common/messages/response.messages';
import * as bcrypt from 'bcrypt';
import { PaginatedList } from '../../common/dto/paginated-list';
import { PaginatedDto } from '../../common/dto/filter-input.dto';
import { ILoginUser } from '../../common/interfaces/login-user.interface';
import dayjs from 'dayjs';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.user;
  }

  async create(input: CreateUserDto, repository = this.repository): Promise<User> {
    return repository.create({ data: input });
  }

  async findAll(filters?: PaginatedDto): Promise<PaginatedList<User>> {
    const totalItems = await this.repository.count();
    const items = await this.repository.findMany(filters);

    return new PaginatedList(items, totalItems);
  }

  async findOne(id: ID): Promise<User> {
    return this.repository.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.repository.findUnique({
      where: { email },
    });
  }

  async findByRecoverPasswordToken(recoverPasswordToken: string) {
    return this.repository.findFirst({
      where: { recoverPasswordToken },
    });
  }

  async findByEmailLogin(email: string): Promise<ILoginUser | null> {
    return this.repository.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async resetPassword(id: ID, plainPassword: string) {
    const passwordHash = await bcrypt.hash(plainPassword, 12);
    return this.repository.update({
      where: { id },
      data: { password: passwordHash, recoverPasswordToken: null, recoverPasswordTokenExpire: null },
    });
  }

  async exists(id: ID): Promise<boolean> {
    const result = await this.repository.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!result;
  }

  async delete(id: ID) {
    if (!(await this.exists(id))) return this.notFound(id);

    try {
      const result = await this.repository.delete({ where: { id } });
      return new DeleteResult(!!result);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateLastLogin(id: ID): Promise<void> {
    await this.repository.update({ where: { id }, data: { lastLogin: dayjs().toISOString() } }).catch((e) => e);
  }

  async setRecoverPasswordData(id: ID, token: string) {
    const user = await this.findOne(id);
    if (!user) throw this.notFound(id);

    user.recoverPasswordToken = token;
    user.recoverPasswordTokenExpire = dayjs().add(30, 'minute').toDate();
    await this.repository.create({ data: user });
  }

  notFound(id: ID): NotFoundError {
    const { entity } = responseMessages.user;
    return new NotFoundError(responseMessages.notFound(entity), id.toString());
  }

  getCredentials(email: string) {
    return this.repository.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  }
}
