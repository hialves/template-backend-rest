import { Session } from '@prisma/client';

export interface IUserSession extends Pick<Session, 'id' | 'token' | 'expiresAt' | 'valid' | 'userId'> {}
