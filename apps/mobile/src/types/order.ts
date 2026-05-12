import type { IsoDate, Money, UUID } from './common';

export type OrderStatus =
  | 'CREATED'
  | 'WAITING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PREPARATION'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'SIMULATED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REFUNDED'
  | 'CANCELLED';

export interface OrderItem {
  id: UUID;
  listingId: UUID;
  sellerId: UUID;
  bookTitle: string;
  bookCoverUrl?: string;
  quantity: number;
  unitPrice: Money;
  subtotal: Money;
}

export interface Order {
  id: UUID;
  code: string;
  buyerId: UUID;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotalAmount: Money;
  shippingAmount: Money;
  totalAmount: Money;
  createdAt: IsoDate;
}
