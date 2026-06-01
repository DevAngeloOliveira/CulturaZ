import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/feedback/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import {
  useAdminListingsQuery,
  useApproveListingMutation,
  useBlockListingMutation,
} from '@/hooks/api';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { ListingResponse, ListingStatus } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL, formatCondition } from '@/utils/format';

type Filter = 'PENDING_REVIEW' | 'ACTIVE' | 'BLOCKED' | 'ALL';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'PENDING_REVIEW', label: 'Pendentes' },
  { value: 'ACTIVE', label: 'Ativos' },
  { value: 'BLOCKED', label: 'Bloqueados' },
  { value: 'ALL', label: 'Todos' },
];

const STATUS_LABEL: Record<ListingStatus, string> = {
  PENDING_REVIEW: 'Em análise',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  BLOCKED: 'Bloqueado',
  SOLD_OUT: 'Esgotado',
  REMOVED: 'Removido',
};

const STATUS_TONE: Record<ListingStatus, 'success' | 'warning' | 'info' | 'error' | 'neutral'> = {
  PENDING_REVIEW: 'warning',
  ACTIVE: 'success',
  PAUSED: 'neutral',
  BLOCKED: 'error',
  SOLD_OUT: 'info',
  REMOVED: 'neutral',
};

export const AdminModerationScreen = () => {
  const [filter, setFilter] = useState<Filter>('PENDING_REVIEW');
  const listingsQuery = useAdminListingsQuery({
    status: filter === 'ALL' ? undefined : filter,
    size: 50,
  });
  const approveListing = useApproveListingMutation();
  const blockListing = useBlockListingMutation();

  const onApprove = (l: ListingResponse) =>
    approveListing.mutate(l.id, {
      onError: (err) => Alert.alert('Falha ao aprovar', getErrorMessage(err)),
    });

  const onBlock = (l: ListingResponse) => {
    Alert.alert('Bloquear anúncio?', `"${l.book.title}" será removido do catálogo.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Bloquear',
        style: 'destructive',
        onPress: () =>
          blockListing.mutate(
            { id: l.id, body: { reason: 'Violação de política' } },
            { onError: (err) => Alert.alert('Falha ao bloquear', getErrorMessage(err)) },
          ),
      },
    ]);
  };

  const mutating = approveListing.isPending || blockListing.isPending;

  const renderItem = ({ item }: { item: ListingResponse }) => (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.row}>
        {item.coverImageUrl ? (
          <Image source={{ uri: item.coverImageUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={[styles.cover, styles.coverFallback]}>
            <Ionicons name="book-outline" size={22} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.body}>
          <Badge label={STATUS_LABEL[item.status]} tone={STATUS_TONE[item.status]} />
          <Text style={styles.title} numberOfLines={2}>
            {item.book.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {item.book.author} · {item.seller.storeName}
          </Text>
          <Text style={styles.meta}>
            {formatCondition(item.condition)} · estoque {item.stockQuantity}
          </Text>
          <Text style={styles.price}>{formatBRL(item.price)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {item.status === 'PENDING_REVIEW' || item.status === 'BLOCKED' ? (
          <Pressable
            onPress={() => onApprove(item)}
            disabled={mutating}
            style={styles.actionBtn}
            hitSlop={6}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.actionLabel}>Aprovar</Text>
          </Pressable>
        ) : null}
        {item.status !== 'BLOCKED' && item.status !== 'REMOVED' ? (
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
      </View>
    </View>
  );

  const renderBody = () => {
    if (listingsQuery.isLoading) return <LoadingState message="Carregando anúncios…" />;
    if (listingsQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar"
          description={getErrorMessage(listingsQuery.error)}
          onRetry={() => listingsQuery.refetch()}
        />
      );
    }
    const items = listingsQuery.data?.items ?? [];
    if (items.length === 0) {
      return (
        <EmptyState
          icon="shield-checkmark-outline"
          title="Tudo limpo por aqui"
          description="Nenhum anúncio neste filtro."
        />
      );
    }
    return (
      <FlatList
        data={items}
        keyExtractor={(l) => l.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        refreshing={listingsQuery.isRefetching}
        onRefresh={() => listingsQuery.refetch()}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Moderação</Text>
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
  separator: { height: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cover: {
    width: 64,
    height: 92,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  price: {
    ...typography.bodyStrong,
    color: colors.primary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
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
