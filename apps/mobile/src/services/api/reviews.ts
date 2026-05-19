import type { CreateReviewRequest, ReviewResponse } from '@/types/api';

import { httpClient } from '../http';

export const reviewsApi = {
  create: (body: CreateReviewRequest): Promise<ReviewResponse> =>
    httpClient.post<ReviewResponse>('/api/reviews', { body }),
};
