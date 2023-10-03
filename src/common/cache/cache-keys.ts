import { ID } from '../../@types';
import { FilterWithoutDefaultValuesDto } from '../dto/filter-input.dto';

export const cacheKeys = {
  sms: {
    login: (code: string) => `SMS_CODE/LOGIN/${code}`,
    preCreate: (code: string) => `SMS_CODE/PRE_CREATE/${code}`,
    preCreateByPhone: (phone: string) => `SMS_CODE/PRE_CREATE/PHONE/${phone}`,
  },
  email: {
    recoverPassword: (email: string, code: string) => `EMAIL_CODE/RECOVER_PASSWORD/EMAIL/${email}/CODE/${code}`,
  },
  resolver: {
    customer: (id: string) => `RESOLVER/CUSTOMER/ID/${id}`,
    user: (id: string) => `RESOLVER/USER/ID/${id}`,
    expertiseCustomerId: (customerId: string, filters?: FilterWithoutDefaultValuesDto) =>
      `RESOLVER/EXPERTISE/CUSTOMER_ID/${customerId}${filters ? `?${JSON.stringify(filters)}` : ''}`,
  },
  auth: {
    session: (token: string) => `SESSION/${token}`,
  },
  session: {
    userById: (userId: ID) => `SESSION_USER_BY_ID/${userId}`,
  },
};
