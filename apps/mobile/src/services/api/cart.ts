import type { AddCartItemRequest, CartResponse, UpdateCartItemRequest } from '@/types/api';

import { httpClient } from '../http';

export const cartApi = {
  get: (): Promise<CartResponse> => httpClient.get<CartResponse>('/api/cart'),

  addItem: (body: AddCartItemRequest): Promise<CartResponse> =>
    httpClient.post<CartResponse>('/api/cart/items', { body }),

  updateItem: (id: string, body: UpdateCartItemRequest): Promise<CartResponse> =>
    httpClient.put<CartResponse>(`/api/cart/items/${id}`, { body }),

  removeItem: (id: string): Promise<CartResponse> =>
    httpClient.delete<CartResponse>(`/api/cart/items/${id}`),
};
