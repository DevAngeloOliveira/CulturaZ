import { useQuery } from '@tanstack/react-query';

import { listingsApi, type ListingSearchParams } from '@/services/api';

import { queryKeys } from './queryKeys';

export const useListingsQuery = (params: ListingSearchParams = {}) =>
  useQuery({
    queryKey: queryKeys.listings.list(params),
    queryFn: () => listingsApi.search(params),
  });

export const useListingQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.listings.detail(id ?? ''),
    queryFn: () => listingsApi.getById(id as string),
    enabled: Boolean(id),
  });
