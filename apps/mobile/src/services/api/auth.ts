import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from '@/types/api';

import { httpClient } from '../http';

export const authApi = {
  login: (body: LoginRequest): Promise<AuthResponse> =>
    httpClient.post<AuthResponse>('/api/auth/login', { body, auth: false }),

  register: (body: RegisterRequest): Promise<AuthResponse> =>
    httpClient.post<AuthResponse>('/api/auth/register', { body, auth: false }),

  me: (): Promise<UserResponse> => httpClient.get<UserResponse>('/api/auth/me'),

  logout: (): Promise<void> => httpClient.post<void>('/api/auth/logout'),
};
