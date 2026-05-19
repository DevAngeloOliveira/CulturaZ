import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reviewsApi } from '@/services/api';
import type { CreateReviewRequest } from '@/types/api';

import { queryKeys } from './queryKeys';

export const useCreateReviewMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateReviewRequest) => reviewsApi.create(body),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.orders.all }),
  });
};
