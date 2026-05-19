import { adminApi } from './admin';
import { authApi } from './auth';
import { booksApi } from './books';
import { cartApi } from './cart';
import { categoriesApi } from './categories';
import { favoritesApi } from './favorites';
import { listingsApi } from './listings';
import { ordersApi } from './orders';
import { reviewsApi } from './reviews';
import { sellersApi } from './sellers';
import { usersApi } from './users';

export const api = {
  auth: authApi,
  users: usersApi,
  categories: categoriesApi,
  books: booksApi,
  listings: listingsApi,
  favorites: favoritesApi,
  cart: cartApi,
  orders: ordersApi,
  reviews: reviewsApi,
  sellers: sellersApi,
  admin: adminApi,
} as const;

export {
  adminApi,
  authApi,
  booksApi,
  cartApi,
  categoriesApi,
  favoritesApi,
  listingsApi,
  ordersApi,
  reviewsApi,
  sellersApi,
  usersApi,
};
export type { ListingSearchParams } from './listings';
export type { BookSearchParams } from './books';
export type { OrderListParams } from './orders';
export type { SellerPageParams } from './sellers';
export type {
  AdminListingListParams,
  AdminOrderListParams,
  AdminUserListParams,
} from './admin';
