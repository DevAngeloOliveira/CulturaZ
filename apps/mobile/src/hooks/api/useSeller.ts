import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sellersApi, type SellerPageParams } from '@/services/api';
import type {
  CreateListingRequest,
  CreateSellerRequest,
  UpdateListingRequest,
  UpdateOrderStatusRequest,
  UpdateSellerRequest,
} from '@/types/api';

import { queryKeys } from './queryKeys';

const invalidateSeller = (client: ReturnType<typeof useQueryClient>) => {
  client.invalidateQueries({ queryKey: queryKeys.seller.profile });
  client.invalidateQueries({ queryKey: queryKeys.seller.dashboard });
};

const invalidateListings = (client: ReturnType<typeof useQueryClient>) => {
  client.invalidateQueries({ queryKey: ['seller', 'listings'] });
  client.invalidateQueries({ queryKey: queryKeys.seller.dashboard });
};

const invalidateOrders = (client: ReturnType<typeof useQueryClient>) => {
  client.invalidateQueries({ queryKey: ['seller', 'orders'] });
  client.invalidateQueries({ queryKey: queryKeys.seller.dashboard });
};

export const useSellerProfileQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.seller.profile,
    queryFn: () => sellersApi.getMine(),
    enabled,
  });

export const useActivateSellerMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSellerRequest) => sellersApi.activate(body),
    onSuccess: () => invalidateSeller(client),
  });
};

export const useUpdateSellerMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSellerRequest) => sellersApi.updateMine(body),
    onSuccess: () => invalidateSeller(client),
  });
};

export const useSellerDashboardQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.seller.dashboard,
    queryFn: () => sellersApi.getDashboard(),
    enabled,
  });

export const useSellerReputationQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.seller.reputation,
    queryFn: () => sellersApi.getReputation(),
    enabled,
  });

export const useSellerListingsQuery = (params: SellerPageParams = {}, enabled = true) =>
  useQuery({
    queryKey: queryKeys.seller.listings(params),
    queryFn: () => sellersApi.listListings(params),
    enabled,
  });

export const useSellerListingQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.seller.listing(id ?? ''),
    queryFn: () => sellersApi.getListing(id as string),
    enabled: Boolean(id),
  });

export const useCreateSellerListingMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateListingRequest) => sellersApi.createListing(body),
    onSuccess: () => invalidateListings(client),
  });
};

export const useUpdateSellerListingMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateListingRequest }) =>
      sellersApi.updateListing(id, body),
    onSuccess: () => invalidateListings(client),
  });
};

export const usePauseListingMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sellersApi.pauseListing(id),
    onSuccess: () => invalidateListings(client),
  });
};

export const useActivateListingMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sellersApi.activateListing(id),
    onSuccess: () => invalidateListings(client),
  });
};

export const useRemoveListingMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sellersApi.removeListing(id),
    onSuccess: () => invalidateListings(client),
  });
};

export const useSellerOrdersQuery = (params: SellerPageParams = {}, enabled = true) =>
  useQuery({
    queryKey: queryKeys.seller.orders(params),
    queryFn: () => sellersApi.listOrders(params),
    enabled,
  });

export const useSellerOrderQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.seller.order(id ?? ''),
    queryFn: () => sellersApi.getOrder(id as string),
    enabled: Boolean(id),
  });

export const useUpdateOrderStatusMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateOrderStatusRequest }) =>
      sellersApi.updateOrderStatus(id, body),
    onSuccess: (order) => {
      client.setQueryData(queryKeys.seller.order(order.id), order);
      invalidateOrders(client);
    },
  });
};
