import type {
  AddressRequest,
  AddressResponse,
  UpdateUserRequest,
  UserResponse,
} from '@/types/api';

import { httpClient } from '../http';

export const usersApi = {
  me: (): Promise<UserResponse> => httpClient.get<UserResponse>('/api/users/me'),

  updateMe: (body: UpdateUserRequest): Promise<UserResponse> =>
    httpClient.put<UserResponse>('/api/users/me', { body }),

  listAddresses: (): Promise<AddressResponse[]> =>
    httpClient.get<AddressResponse[]>('/api/users/me/addresses'),

  createAddress: (body: AddressRequest): Promise<AddressResponse> =>
    httpClient.post<AddressResponse>('/api/users/me/addresses', { body }),

  updateAddress: (id: string, body: AddressRequest): Promise<AddressResponse> =>
    httpClient.put<AddressResponse>(`/api/users/me/addresses/${id}`, { body }),

  deleteAddress: (id: string): Promise<void> =>
    httpClient.delete<void>(`/api/users/me/addresses/${id}`),

  setDefaultAddress: (id: string): Promise<AddressResponse> =>
    httpClient.patch<AddressResponse>(`/api/users/me/addresses/${id}/default`),
};
