import type { components } from './api.generated';

export type Schemas = components['schemas'];

export type AuthResponse = Schemas['AuthResponse'];
export type LoginRequest = Schemas['LoginRequest'];
export type RegisterRequest = Schemas['RegisterRequest'];
export type RefreshTokenRequest = Schemas['RefreshTokenRequest'];

export type UserResponse = Schemas['UserResponse'];
export type UpdateUserRequest = Schemas['UpdateUserRequest'];
export type AddressResponse = Schemas['AddressResponse'];
export type AddressRequest = Schemas['AddressRequest'];

export type CategoryResponse = Schemas['CategoryResponse'];
export type BookResponse = Schemas['BookResponse'];
export type ListingResponse = Schemas['ListingResponse'];

export type FavoriteResponse = Schemas['FavoriteResponse'];
export type CartResponse = Schemas['CartResponse'];
export type CartItemResponse = Schemas['CartItemResponse'];
export type AddCartItemRequest = Schemas['AddCartItemRequest'];
export type UpdateCartItemRequest = Schemas['UpdateCartItemRequest'];

export type OrderResponse = Schemas['OrderResponse'];
export type OrderItemResponse = Schemas['OrderItemResponse'];
export type CreateOrderRequest = Schemas['CreateOrderRequest'];
export type CancelOrderRequest = Schemas['CancelOrderRequest'];

export type ReviewResponse = Schemas['ReviewResponse'];
export type CreateReviewRequest = Schemas['CreateReviewRequest'];

export type SellerProfileResponse = Schemas['SellerProfileResponse'];
export type CreateSellerRequest = Schemas['CreateSellerRequest'];
export type UpdateSellerRequest = Schemas['UpdateSellerRequest'];
export type SellerDashboardResponse = Schemas['SellerDashboardResponse'];
export type SellerReputationResponse = Schemas['SellerReputationResponse'];

export type CreateListingRequest = Schemas['CreateListingRequest'];
export type UpdateListingRequest = Schemas['UpdateListingRequest'];
export type CreateBookRequest = Schemas['CreateBookRequest'];

export type AdminDashboardResponse = Schemas['AdminDashboardResponse'];
export type AdminUserResponse = Schemas['AdminUserResponse'];
export type UpdateOrderStatusRequest = Schemas['UpdateOrderStatusRequest'];
export type BlockUserRequest = Schemas['BlockUserRequest'];
export type ModerateListingRequest = Schemas['ModerateListingRequest'];
export type CreateCategoryRequest = Schemas['CreateCategoryRequest'];
export type UpdateCategoryRequest = Schemas['UpdateCategoryRequest'];
export type UpdateBookRequest = Schemas['UpdateBookRequest'];

export type PaginationResponse = Schemas['PaginationResponse'];

export interface Paged<T> {
  items: T[];
  pagination: PaginationResponse;
}

export type ListingCondition = ListingResponse['condition'];
export type ListingStatus = ListingResponse['status'];
export type OrderStatus = OrderResponse['status'];
export type PaymentStatus = OrderResponse['paymentStatus'];
export type ApiUserRole = UserResponse['roles'][number];
