import type {
  CategoryResponse,
  ListingResponse,
  OrderResponse,
} from '@/types/api';
import type { Category } from '@/types/category';
import type { BookListing } from '@/types/listing';
import type { Order } from '@/types/order';

import { discountPercent } from './format';

export const toCategory = (api: CategoryResponse): Category => ({
  id: api.id,
  name: api.name,
  icon: api.icon ?? 'book-outline',
  active: api.active,
});

export const toListing = (
  api: ListingResponse,
  favoriteIds: Set<string> = new Set(),
): BookListing => {
  const price = String(api.price);
  const originalPrice = api.originalPrice != null ? String(api.originalPrice) : undefined;
  const computed = discountPercent(price, originalPrice);
  return {
    id: api.id,
    book: api.book,
    seller: api.seller,
    price,
    originalPrice,
    stockQuantity: api.stockQuantity,
    condition: api.condition,
    status: api.status,
    coverImageUrl: api.coverImageUrl,
    description: api.description,
    city: api.city,
    state: api.state,
    discountPercentage: computed ?? undefined,
    isFavorite: favoriteIds.has(api.id),
  };
};

export const toOrder = (api: OrderResponse): Order => ({
  id: api.id,
  code: api.code,
  buyerId: api.buyerId,
  status: api.status,
  paymentStatus: api.paymentStatus,
  subtotalAmount: String(api.subtotalAmount),
  shippingAmount: String(api.shippingAmount),
  totalAmount: String(api.totalAmount),
  createdAt: api.createdAt,
  items: api.items.map((item) => ({
    id: item.id,
    listingId: item.listingId,
    sellerId: item.sellerId,
    bookTitle: item.bookTitle,
    quantity: item.quantity,
    unitPrice: String(item.unitPrice),
    subtotal: String(item.subtotal),
  })),
});
