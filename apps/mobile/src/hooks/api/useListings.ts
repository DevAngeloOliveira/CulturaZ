import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

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

const DEFAULT_PAGE_SIZE = 20;

export const useInfiniteListingsQuery = (params: ListingSearchParams = {}) =>
  useInfiniteQuery({
    queryKey: queryKeys.listings.list({ ...params, infinite: true } as ListingSearchParams),
    queryFn: ({ pageParam }) =>
      listingsApi.search({ ...params, page: pageParam, size: params.size ?? DEFAULT_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page + 1 < totalPages ? page + 1 : undefined;
    },
  });
