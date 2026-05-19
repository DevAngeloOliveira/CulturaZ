import { useQuery } from '@tanstack/react-query';

import { categoriesApi } from '@/services/api';

import { queryKeys } from './queryKeys';

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoriesApi.list(),
    staleTime: 5 * 60_000,
  });
