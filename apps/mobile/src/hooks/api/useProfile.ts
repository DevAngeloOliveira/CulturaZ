import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usersApi } from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';
import type { AddressRequest, UpdateUserRequest } from '@/types/api';

import { queryKeys } from './queryKeys';

export const useAddressesQuery = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.addresses,
    queryFn: () => usersApi.listAddresses(),
    enabled,
  });

export const useUpdateProfileMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateUserRequest) => usersApi.updateMe(body),
    onSuccess: (user) => {
      client.setQueryData(queryKeys.me, user);
      useAuthStore.setState({ user });
    },
  });
};

const invalidateAddresses = (client: ReturnType<typeof useQueryClient>) =>
  client.invalidateQueries({ queryKey: queryKeys.addresses });

export const useCreateAddressMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: AddressRequest) => usersApi.createAddress(body),
    onSuccess: () => invalidateAddresses(client),
  });
};

export const useUpdateAddressMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddressRequest }) =>
      usersApi.updateAddress(id, body),
    onSuccess: () => invalidateAddresses(client),
  });
};

export const useDeleteAddressMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteAddress(id),
    onSuccess: () => invalidateAddresses(client),
  });
};

export const useSetDefaultAddressMutation = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.setDefaultAddress(id),
    onSuccess: () => invalidateAddresses(client),
  });
};
