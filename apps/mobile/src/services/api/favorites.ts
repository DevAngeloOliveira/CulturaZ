import type { FavoriteResponse } from '@/types/api';

import { httpClient } from '../http';

export const favoritesApi = {
  list: (): Promise<FavoriteResponse[]> =>
    httpClient.get<FavoriteResponse[]>('/api/favorites'),

  add: (listingId: string): Promise<FavoriteResponse> =>
    httpClient.post<FavoriteResponse>(`/api/favorites/${listingId}`),

  remove: (listingId: string): Promise<void> =>
    httpClient.delete<void>(`/api/favorites/${listingId}`),
};
