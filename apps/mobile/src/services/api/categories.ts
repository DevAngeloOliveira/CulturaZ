import type { CategoryResponse } from '@/types/api';

import { httpClient } from '../http';

export const categoriesApi = {
  list: (): Promise<CategoryResponse[]> =>
    httpClient.get<CategoryResponse[]>('/api/categories', { auth: false }),

  getById: (id: string): Promise<CategoryResponse> =>
    httpClient.get<CategoryResponse>(`/api/categories/${id}`, { auth: false }),
};
