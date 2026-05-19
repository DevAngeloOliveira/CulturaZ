import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { favoritesApi } from '@/services/api';

import { queryKeys } from './queryKeys';

export const useFavoritesQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.favorites,
    queryFn: () => favoritesApi.list(),
    enabled,
  });

export const useAddFavoriteMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => favoritesApi.add(listingId),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.favorites }),
  });
};

export const useRemoveFavoriteMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => favoritesApi.remove(listingId),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.favorites }),
  });
};
