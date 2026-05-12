import type { Money, UUID } from './common';
import type { BookListing } from './listing';

export interface CartItem {
  id: UUID;
  listing: BookListing;
  quantity: number;
  unitPrice: Money;
}

export interface Cart {
  id: UUID;
  items: CartItem[];
  subtotalAmount: Money;
}
