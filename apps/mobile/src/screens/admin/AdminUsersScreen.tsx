import { Ionicons } from '@expo/vector-icons';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Badge } from '@/components/feedback/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import {
  useAdminUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} from '@/hooks/api';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { AdminUserResponse, UserResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';

type Filter = 'all' | UserResponse['status'];

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'ACTIVE', label: 'Ativos' },
  { value: 'BLOCKED', label: 'Bloqueados' },
  { value: 'PENDING_VERIFICATION', label: 'Pendentes' },
];

const STATUS_TONE: Record<UserResponse['status'], 'success' | 'warning' | 'error' | 'neutral'> = {
  ACTIVE: 'success',
  BLOCKED: 'error',
  PENDING_VERIFICATION: 'warning',
  DELETED: 'neutral',
};

const STATUS_LABEL: Record<UserResponse['status'], string> = {
  ACTIVE: 'Ativo',
  BLOCKED: 'Bloqueado',
  PENDING_VERIFICATION: 'Pendente',
  DELETED: 'Removido',
};

export const AdminUsersScreen = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const usersQuery = useAdminUsersQuery({
    status: filter === 'all' ? undefined : filter,
    size: 50,
  });
  const blockUser = useBlockUserMutation();
  const unblockUser = useUnblockUserMutation();

  const onBlock = (user: AdminUserResponse) => {
    Alert.alert(
      'Bloquear usuário?',
      `${user.name} (${user.email}) não conseguirá entrar até ser desbloqueado.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: () =>
            blockUser.mutate(
              { id: user.id, body: { reason: 'Bloqueado pela moderação' } },
              { onError: (err) => Alert.alert('Falha', getErrorMessage(err)) },
            ),
        },
      ],
    );
  };

  const onUnblock = (user: AdminUserResponse) => {
    unblockUser.mutate(user.id, {
      onError: (err) => Alert.alert('Falha', getErrorMessage(err)),
    });
  };

  const mutating = blockUser.isPending || unblockUser.isPending;

  const renderItem = ({ item }: { item: AdminUserResponse }) => (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {item.email}
          </Text>
        </View>
        <Badge label={STATUS_LABEL[item.status]} tone={STATUS_TONE[item.status]} />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Roles: {item.roles.join(', ')}</Text>
      </View>
      <View style={styles.actions}>
        {item.status === 'ACTIVE' ? (
          <Pressable
            onPress={() => onBlock(item)}
            disabled={mutating}
            style={styles.actionBtn}
            hitSlop={6}
          >
            <Ionicons name="ban-outline" size={16} color={colors.error} />
            <Text style={[styles.actionLabel, styles.actionLabelDanger]}>Bloquear</Text>
          </Pressable>
        ) : null}
        {item.status === 'BLOCKED' ? (
          <Pressable
            onPress={() => onUnblock(item)}
            disabled={mutating}
            style={styles.actionBtn}
            hitSlop={6}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.actionLabel}>Desbloquear</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  const renderBody = () => {
    if (usersQuery.isLoading) return <LoadingState message="Carregando usuários…" />;
    if (usersQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar"
          description={getErrorMessage(usersQuery.error)}
          onRetry={() => usersQuery.refetch()}
        />
      );
    }
    const items = usersQuery.data?.items ?? [];
    if (items.length === 0) {
      return (
        <EmptyState
          icon="people-outline"
          title="Nenhum usuário"
          description="Nenhum usuário corresponde ao filtro selecionado."
        />
      );
    }
    return (
      <FlatList
        data={items}
        keyExtractor={(u) => u.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        refreshing={usersQuery.isRefetching}
        onRefresh={() => usersQuery.refetch()}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Usuários</Text>
      </View>
      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = f.value === filter;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              style={[styles.filterChip, active ? styles.filterChipActive : null]}
            >
              <Text style={[styles.filterLabel, active ? styles.filterLabelActive : null]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {renderBody()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerTitle: { ...typography.titleLg, color: colors.textPrimary },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  filterLabelActive: {
    color: colors.white,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardHeaderText: {
    flex: 1,
  },
  name: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  email: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionLabel: {
    ...typography.label,
    color: colors.primary,
  },
  actionLabelDanger: {
    color: colors.error,
  },
});
