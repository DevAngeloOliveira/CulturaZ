import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ordersApi, type OrderListParams } from '@/services/api';
import type { CancelOrderRequest, CreateOrderRequest } from '@/types/api';

import { queryKeys } from './queryKeys';

export const useMyOrdersQuery = (params: OrderListParams = {}, enabled = true) =>
  useQuery({
    queryKey: queryKeys.orders.mine(params),
    queryFn: () => ordersApi.listMine(params),
    enabled,
  });

export const useOrderQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.orders.detail(id ?? ''),
    queryFn: () => ordersApi.getById(id as string),
    enabled: Boolean(id),
  });

export const useCreateOrderMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOrderRequest) => ordersApi.create(body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.orders.all });
      client.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useCancelOrderMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CancelOrderRequest }) =>
      ordersApi.cancel(id, body),
    onSuccess: (order) => {
      client.setQueryData(queryKeys.orders.detail(order.id), order);
      client.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};
