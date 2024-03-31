import { HttpStatus, Injectable } from '@nestjs/common';
import { ID } from '../../../@types';
import { CustomerRepository } from '../../repositories/customer-repository.interface';
import { ApplicationError } from '../../errors/application-error';
import { responseMessages } from '../../messages/response.messages';
import { Customer, CustomerFields } from '../../../domain/entities/customer';
import { PasswordService } from '../../interfaces/password-service.interface';
import { UpdateCustomerData } from '../../../domain/valueobjects/update-customer-data';
import { CreateCustomerData } from '../../../domain/valueobjects/create-customer-data';

@Injectable()
export class CustomerService {
  constructor(
    private repository: CustomerRepository,
    private passwordService: PasswordService,
  ) {}

  async create(input: CreateCustomerData) {
    if (input.data.password) input.data.password = await this.passwordService.hashPassword(input.data.password);
    return this.repository.create(input);
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
      ...updateData.data,
    };
    const customer = new Customer(customerFields);

    return this.repository.update(customer);
  }
}
