import type {
  AdminDashboardResponse,
  AdminUserResponse,
  BlockUserRequest,
  CategoryResponse,
  CreateCategoryRequest,
  ListingResponse,
  ListingStatus,
  ModerateListingRequest,
  OrderResponse,
  Paged,
  UpdateCategoryRequest,
  UserResponse,
} from '@/types/api';

import { httpClient } from '../http';

type UserStatus = UserResponse['status'];

export interface AdminUserListParams {
  status?: UserStatus;
  page?: number;
  size?: number;
}

export interface AdminListingListParams {
  status?: ListingStatus;
  page?: number;
  size?: number;
}

export interface AdminOrderListParams {
  page?: number;
  size?: number;
}

export const adminApi = {
  dashboard: (): Promise<AdminDashboardResponse> =>
    httpClient.get<AdminDashboardResponse>('/api/admin/dashboard'),

  listUsers: (params: AdminUserListParams = {}): Promise<Paged<AdminUserResponse>> =>
    httpClient.get<Paged<AdminUserResponse>>('/api/admin/users', { query: { ...params } }),

  getUser: (id: string): Promise<AdminUserResponse> =>
    httpClient.get<AdminUserResponse>(`/api/admin/users/${id}`),

  blockUser: (id: string, body: BlockUserRequest): Promise<AdminUserResponse> =>
    httpClient.patch<AdminUserResponse>(`/api/admin/users/${id}/block`, { body }),

  unblockUser: (id: string): Promise<AdminUserResponse> =>
    httpClient.patch<AdminUserResponse>(`/api/admin/users/${id}/unblock`),

  listListings: (params: AdminListingListParams = {}): Promise<Paged<ListingResponse>> =>
    httpClient.get<Paged<ListingResponse>>('/api/admin/listings', { query: { ...params } }),

  approveListing: (id: string): Promise<ListingResponse> =>
    httpClient.patch<ListingResponse>(`/api/admin/listings/${id}/approve`),

  blockListing: (id: string, body: ModerateListingRequest): Promise<ListingResponse> =>
    httpClient.patch<ListingResponse>(`/api/admin/listings/${id}/block`, { body }),

  listOrders: (params: AdminOrderListParams = {}): Promise<Paged<OrderResponse>> =>
    httpClient.get<Paged<OrderResponse>>('/api/admin/orders', { query: { ...params } }),

  getOrder: (id: string): Promise<OrderResponse> =>
    httpClient.get<OrderResponse>(`/api/admin/orders/${id}`),

  listCategories: (): Promise<CategoryResponse[]> =>
    httpClient.get<CategoryResponse[]>('/api/admin/categories/listing'),

  createCategory: (body: CreateCategoryRequest): Promise<CategoryResponse> =>
    httpClient.post<CategoryResponse>('/api/admin/categories', { body }),

  updateCategory: (id: string, body: UpdateCategoryRequest): Promise<CategoryResponse> =>
    httpClient.put<CategoryResponse>(`/api/admin/categories/${id}`, { body }),

  activateCategory: (id: string): Promise<CategoryResponse> =>
    httpClient.patch<CategoryResponse>(`/api/admin/categories/${id}/activate`),

  deactivateCategory: (id: string): Promise<CategoryResponse> =>
    httpClient.patch<CategoryResponse>(`/api/admin/categories/${id}/deactivate`),
};
