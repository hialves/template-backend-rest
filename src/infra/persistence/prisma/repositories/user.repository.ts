import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ID } from '../../../../@types';
import { UserRepository } from '../../../../application/repositories/user-repository.interface';
import { User } from '../../../../domain/entities/user';
import { User as PrismaUser } from '@prisma/client';

function toDomain(result: PrismaUser | null): User | null {
  if (result) return new User(result);
  return null;
}

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.user;
  }

  async findById(id: ID): Promise<User | null> {
    const result = await this.repository.findUnique({
      where: { id },
    });
    return toDomain(result);
  }

  async findByEmail(email: string) {
    const result = await this.repository.findUnique({
      where: { email },
    });
    return toDomain(result);
  }

  async findByRecoverPasswordToken(recoverPasswordToken: string) {
    const result = await this.repository.findFirst({
      where: { recoverPasswordToken },
    });
    return toDomain(result);
  }

  async exists(id: ID): Promise<boolean> {
    const result = await this.repository.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!result;
  }

  async update(input: User): Promise<User> {
    return new User(await this.repository.update({ where: { id: input.id }, data: input }));
  }
}
