import type { BookResponse, CreateBookRequest, Paged } from '@/types/api';

import { httpClient } from '../http';

export interface BookSearchParams {
  q?: string;
  categoryId?: string;
  author?: string;
  isbn?: string;
  page?: number;
  size?: number;
}

export const booksApi = {
  search: (params: BookSearchParams = {}): Promise<Paged<BookResponse>> =>
    httpClient.get<Paged<BookResponse>>('/api/books', { auth: false, query: { ...params } }),

  getById: (id: string): Promise<BookResponse> =>
    httpClient.get<BookResponse>(`/api/books/${id}`, { auth: false }),

  create: (body: CreateBookRequest): Promise<BookResponse> =>
    httpClient.post<BookResponse>('/api/books', { body }),
};
