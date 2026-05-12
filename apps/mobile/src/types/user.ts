import type { IsoDate, UUID } from './common';

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPPORT';

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING_VERIFICATION' | 'DELETED';

export interface User {
  id: UUID;
  name: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  status: UserStatus;
  createdAt: IsoDate;
}
