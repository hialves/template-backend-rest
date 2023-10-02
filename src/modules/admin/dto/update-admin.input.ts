import { CreateAdminInput } from './create-admin.input';
import { PartialType } from '@nestjs/swagger';

export class UpdateAdminInput extends PartialType(CreateAdminInput) {}
