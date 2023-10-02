import { IUserSession } from '../common/interfaces/session.interface';

declare global {
  namespace Express {
    export interface Request {
      requestId?: string;
      session?: IUserSession;
    }
  }
}
