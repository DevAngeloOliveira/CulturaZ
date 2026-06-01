import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  adminApi,
  type AdminListingListParams,
  type AdminOrderListParams,
  type AdminUserListParams,
} from '@/services/api';
import type {
  BlockUserRequest,
  CreateCategoryRequest,
  ModerateListingRequest,
  UpdateCategoryRequest,
} from '@/types/api';

import { queryKeys } from './queryKeys';

const invalidateUsers = (client: ReturnType<typeof useQueryClient>) => {
  client.invalidateQueries({ queryKey: ['admin', 'users'] });
  client.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
};

const invalidateListings = (client: ReturnType<typeof useQueryClient>) => {
  client.invalidateQueries({ queryKey: ['admin', 'listings'] });
  client.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
  client.invalidateQueries({ queryKey: queryKeys.listings.all });
};

const invalidateCategories = (client: ReturnType<typeof useQueryClient>) => {
  client.invalidateQueries({ queryKey: queryKeys.admin.categories });
  client.invalidateQueries({ queryKey: queryKeys.categories });
};

export const useAdminDashboardQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: () => adminApi.dashboard(),
    enabled,
  });

export const useAdminUsersQuery = (params: AdminUserListParams = {}, enabled = true) =>
  useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => adminApi.listUsers(params),
    enabled,
  });

export const useAdminUserQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.admin.user(id ?? ''),
    queryFn: () => adminApi.getUser(id as string),
    enabled: Boolean(id),
  });

export const useBlockUserMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: BlockUserRequest }) =>
      adminApi.blockUser(id, body),
    onSuccess: () => invalidateUsers(client),
  });
};

export const useUnblockUserMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.unblockUser(id),
    onSuccess: () => invalidateUsers(client),
  });
};

export const useAdminListingsQuery = (params: AdminListingListParams = {}, enabled = true) =>
  useQuery({
    queryKey: queryKeys.admin.listings(params),
    queryFn: () => adminApi.listListings(params),
    enabled,
  });

export const useApproveListingMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.approveListing(id),
    onSuccess: () => invalidateListings(client),
  });
};

export const useBlockListingMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ModerateListingRequest }) =>
      adminApi.blockListing(id, body),
    onSuccess: () => invalidateListings(client),
  });
};

export const useAdminOrdersQuery = (params: AdminOrderListParams = {}, enabled = true) =>
  useQuery({
    queryKey: queryKeys.admin.orders(params),
    queryFn: () => adminApi.listOrders(params),
    enabled,
  });

export const useAdminOrderQuery = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.admin.order(id ?? ''),
    queryFn: () => adminApi.getOrder(id as string),
    enabled: Boolean(id),
  });

export const useAdminCategoriesQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: () => adminApi.listCategories(),
    enabled,
  });

export const useCreateCategoryMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) => adminApi.createCategory(body),
    onSuccess: () => invalidateCategories(client),
  });
};

export const useUpdateCategoryMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCategoryRequest }) =>
      adminApi.updateCategory(id, body),
    onSuccess: () => invalidateCategories(client),
  });
};

export const useActivateCategoryMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.activateCategory(id),
    onSuccess: () => invalidateCategories(client),
  });
};

export const useDeactivateCategoryMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deactivateCategory(id),
    onSuccess: () => invalidateCategories(client),
  });
};
