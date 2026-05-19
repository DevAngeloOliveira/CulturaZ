import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { cartApi } from '@/services/api';
import type { AddCartItemRequest, CartResponse, UpdateCartItemRequest } from '@/types/api';

import { queryKeys } from './queryKeys';

export const useCartQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.cart,
    queryFn: () => cartApi.get(),
    enabled,
  });

export const useAddCartItemMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: AddCartItemRequest) => cartApi.addItem(body),
    onSuccess: (cart) => client.setQueryData<CartResponse>(queryKeys.cart, cart),
  });
};

export const useUpdateCartItemMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCartItemRequest }) =>
      cartApi.updateItem(id, body),
    onSuccess: (cart) => client.setQueryData<CartResponse>(queryKeys.cart, cart),
  });
};

export const useRemoveCartItemMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cartApi.removeItem(id),
    onSuccess: (cart) => client.setQueryData<CartResponse>(queryKeys.cart, cart),
  });
};
