import { ID } from '../../../@types';
import { PaginatedDto } from '../../../common/dto/filter-input.dto';
import { PaginatedList } from '../../../common/dto/paginated-list';
import { responseMessages } from '../../../common/messages/response.messages';
import { DeleteResult, NotFoundError } from '../../../common/responses/result-type';
import { AdminModel } from '../../../domain/model/admin.model';
import { IAdminRepository } from '../../../domain/repositories/admin-repository.interface';
import { CreateAdminDto, UpdateAdminDto } from '../../../presentation/controllers/admin/admin.dto';

export class AdminService {
  constructor(private repository: IAdminRepository) {}

  async create(dto: CreateAdminDto): Promise<AdminModel> {
    return this.repository.create(dto);
  }

  async findAll(filters?: PaginatedDto): Promise<PaginatedList<AdminModel>> {
    const count = await this.repository.count();
    const items = await this.repository.findMany(filters);

    return new PaginatedList(items, count);
  }

  findOne(id: ID) {
    return this.repository.findOne(id);
  }

  update(id: ID, dto: UpdateAdminDto) {
    return this.repository.update(id, dto);
  }

  async remove(id: ID) {
    if (!(await this.findOne)) throw new NotFoundError(responseMessages.notFound(responseMessages.user));
    await this.repository.delete(id);
    return new DeleteResult(true);
  }

  getByUserId(userId: ID): Promise<AdminModel | null> {
    return this.repository.findOneBy('userId', userId, true);
  }
}
