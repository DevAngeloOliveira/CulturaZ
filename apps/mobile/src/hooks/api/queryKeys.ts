import type {
  AdminListingListParams,
  AdminOrderListParams,
  AdminUserListParams,
  BookSearchParams,
  ListingSearchParams,
  OrderListParams,
  SellerPageParams,
} from '@/services/api';

export const queryKeys = {
  me: ['me'] as const,

  categories: ['categories'] as const,

  listings: {
    all: ['listings'] as const,
    list: (params: ListingSearchParams) => ['listings', 'list', params] as const,
    detail: (id: string) => ['listings', 'detail', id] as const,
  },

  books: {
    all: ['books'] as const,
    list: (params: BookSearchParams) => ['books', 'list', params] as const,
    detail: (id: string) => ['books', 'detail', id] as const,
  },

  favorites: ['favorites'] as const,

  cart: ['cart'] as const,

  orders: {
    all: ['orders'] as const,
    mine: (params: OrderListParams) => ['orders', 'mine', params] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },

  addresses: ['addresses'] as const,

  seller: {
    profile: ['seller', 'profile'] as const,
    dashboard: ['seller', 'dashboard'] as const,
    reputation: ['seller', 'reputation'] as const,
    listings: (params: SellerPageParams) => ['seller', 'listings', params] as const,
    listing: (id: string) => ['seller', 'listing', id] as const,
    orders: (params: SellerPageParams) => ['seller', 'orders', params] as const,
    order: (id: string) => ['seller', 'order', id] as const,
    reviews: (id: string) => ['seller', 'reviews', id] as const,
  },

  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    users: (params: AdminUserListParams) => ['admin', 'users', params] as const,
    user: (id: string) => ['admin', 'user', id] as const,
    listings: (params: AdminListingListParams) => ['admin', 'listings', params] as const,
    orders: (params: AdminOrderListParams) => ['admin', 'orders', params] as const,
    order: (id: string) => ['admin', 'order', id] as const,
    categories: ['admin', 'categories'] as const,
  },
} as const;
