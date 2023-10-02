import { CreateCustomerInput } from './create-customer.input';
import { PartialType } from '@nestjs/swagger';

export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {}
