import type { UUID } from './common';

export type SellerType = 'INDIVIDUAL' | 'BOOKSTORE' | 'SEBO';
export type SellerStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_REVIEW';

export interface SellerProfile {
  id: UUID;
  userId: UUID;
  storeName: string;
  description?: string;
  type: SellerType;
  rating: number;
  status: SellerStatus;
  activeListingsCount?: number;
  isVerified?: boolean;
  city?: string;
  state?: string;
}
