import type { BookResponse, Paged } from '@/types/api';

import { httpClient } from '../http';

export interface BookSearchParams {
  q?: string;
  page?: number;
  size?: number;
}

export const booksApi = {
  search: (params: BookSearchParams = {}): Promise<Paged<BookResponse>> =>
    httpClient.get<Paged<BookResponse>>('/api/books', { auth: false, query: { ...params } }),

  getById: (id: string): Promise<BookResponse> =>
    httpClient.get<BookResponse>(`/api/books/${id}`, { auth: false }),
};
