import type {
  CreateListingRequest,
  CreateSellerRequest,
  ListingResponse,
  OrderResponse,
  Paged,
  ReviewResponse,
  SellerDashboardResponse,
  SellerProfileResponse,
  SellerReputationResponse,
  UpdateListingRequest,
  UpdateOrderStatusRequest,
  UpdateSellerRequest,
} from '@/types/api';

import { httpClient } from '../http';

export interface SellerPageParams {
  page?: number;
  size?: number;
  sort?: string;
}

export const sellersApi = {
  activate: (body: CreateSellerRequest): Promise<SellerProfileResponse> =>
    httpClient.post<SellerProfileResponse>('/api/sellers', { body }),

  getMine: (): Promise<SellerProfileResponse> =>
    httpClient.get<SellerProfileResponse>('/api/sellers/me'),

  updateMine: (body: UpdateSellerRequest): Promise<SellerProfileResponse> =>
    httpClient.put<SellerProfileResponse>('/api/sellers/me', { body }),

  getById: (id: string): Promise<SellerProfileResponse> =>
    httpClient.get<SellerProfileResponse>(`/api/sellers/${id}`, { auth: false }),

  getReviews: (id: string): Promise<ReviewResponse[]> =>
    httpClient.get<ReviewResponse[]>(`/api/sellers/${id}/reviews`, { auth: false }),

  getDashboard: (): Promise<SellerDashboardResponse> =>
    httpClient.get<SellerDashboardResponse>('/api/sellers/me/dashboard'),

  getReputation: (): Promise<SellerReputationResponse> =>
    httpClient.get<SellerReputationResponse>('/api/sellers/me/reputation'),

  listListings: (params: SellerPageParams = {}): Promise<Paged<ListingResponse>> =>
    httpClient.get<Paged<ListingResponse>>('/api/seller/listings', { query: { ...params } }),

  getListing: (id: string): Promise<ListingResponse> =>
    httpClient.get<ListingResponse>(`/api/seller/listings/${id}`),

  createListing: (body: CreateListingRequest): Promise<ListingResponse> =>
    httpClient.post<ListingResponse>('/api/seller/listings', { body }),

  updateListing: (id: string, body: UpdateListingRequest): Promise<ListingResponse> =>
    httpClient.put<ListingResponse>(`/api/seller/listings/${id}`, { body }),

  removeListing: (id: string): Promise<void> =>
    httpClient.delete<void>(`/api/seller/listings/${id}`),

  pauseListing: (id: string): Promise<ListingResponse> =>
    httpClient.patch<ListingResponse>(`/api/seller/listings/${id}/pause`),

  activateListing: (id: string): Promise<ListingResponse> =>
    httpClient.patch<ListingResponse>(`/api/seller/listings/${id}/activate`),

  listOrders: (params: SellerPageParams = {}): Promise<Paged<OrderResponse>> =>
    httpClient.get<Paged<OrderResponse>>('/api/seller/orders', { query: { ...params } }),

  getOrder: (id: string): Promise<OrderResponse> =>
    httpClient.get<OrderResponse>(`/api/seller/orders/${id}`),

  updateOrderStatus: (id: string, body: UpdateOrderStatusRequest): Promise<OrderResponse> =>
    httpClient.patch<OrderResponse>(`/api/seller/orders/${id}/status`, { body }),
};
