import type {
  CancelOrderRequest,
  CreateOrderRequest,
  OrderResponse,
  Paged,
} from '@/types/api';

import { httpClient } from '../http';

export interface OrderListParams {
  page?: number;
  size?: number;
}

export const ordersApi = {
  create: (body: CreateOrderRequest): Promise<OrderResponse> =>
    httpClient.post<OrderResponse>('/api/orders', { body }),

  listMine: (params: OrderListParams = {}): Promise<Paged<OrderResponse>> =>
    httpClient.get<Paged<OrderResponse>>('/api/orders/me', { query: { ...params } }),

  getById: (id: string): Promise<OrderResponse> =>
    httpClient.get<OrderResponse>(`/api/orders/${id}`),

  cancel: (id: string, body: CancelOrderRequest): Promise<OrderResponse> =>
    httpClient.patch<OrderResponse>(`/api/orders/${id}/cancel`, { body }),
};
