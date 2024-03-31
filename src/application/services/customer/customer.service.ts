import { HttpStatus, Injectable } from '@nestjs/common';
import { ID } from '../../../@types';
import { User } from '../../../domain/entities/user';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { Customer, CustomerFields } from '../../../domain/entities/customer';
import { PasswordService } from '../../interfaces/password-service.interface';
import { UpdateCustomerData } from '../../../domain/valueobjects/update-customer-data';

@Injectable()
export class CustomerService {
  constructor(
    private repository: CustomerRepository,
    private passwordService: PasswordService,
  ) {}

  async create(customer: Customer, user: User) {
    if (user.password) user.password = await this.passwordService.hashPassword(user.password);
    return this.repository.create(customer, user);
  }

  async update(id: ID, updateData: UpdateCustomerData): Promise<Customer | ApplicationError> {
    const existsCustomer = await this.repository.findById(id);
    if (!existsCustomer)
      return new ApplicationError(
        responseMessages.notFound(responseMessages.customer.entity),
        undefined,
        HttpStatus.NOT_FOUND,
      );

    const customerFields: CustomerFields = {
      ...existsCustomer,
      email: updateData.email || existsCustomer.email,
      name: updateData.name || existsCustomer.name,
      cardToken: updateData.cardToken || existsCustomer.cardToken,
      phone: updateData.phone || existsCustomer.phone,
    };
    const customer = new Customer(customerFields);

    return this.repository.update(customer);
  }
}
