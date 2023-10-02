import { ID } from '../../@types';
import { DeleteResult, NotFoundError } from '../responses/result-type';

export interface Crud {
  exists(id: ID): Promise<boolean>;
  notFound(id: ID): NotFoundError;
  delete(id: ID): Promise<DeleteResult | NotFoundError>;
}
