import type { ListingCondition, ListingResponse, Paged } from '@/types/api';

import { httpClient } from '../http';

export interface ListingSearchParams {
  q?: string;
  categoryId?: string;
  condition?: ListingCondition;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  state?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const listingsApi = {
  search: (params: ListingSearchParams = {}): Promise<Paged<ListingResponse>> =>
    httpClient.get<Paged<ListingResponse>>('/api/listings', {
      auth: false,
      query: { ...params },
    }),

  getById: (id: string): Promise<ListingResponse> =>
    httpClient.get<ListingResponse>(`/api/listings/${id}`, { auth: false }),
};
