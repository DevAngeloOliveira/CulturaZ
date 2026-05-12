import type { Book } from './book';
import type { Money, UUID } from './common';
import type { SellerProfile } from './seller';

export type BookCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'DAMAGED';

export type ListingStatus =
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'PAUSED'
  | 'BLOCKED'
  | 'SOLD_OUT'
  | 'REMOVED';

export interface BookListing {
  id: UUID;
  book: Book;
  seller: SellerProfile;
  price: Money;
  originalPrice?: Money;
  stockQuantity: number;
  condition: BookCondition;
  status: ListingStatus;
  coverImageUrl?: string;
  description: string;
  city?: string;
  state?: string;
  tags?: string[];
  discountPercentage?: number;
  isFavorite?: boolean;
}
