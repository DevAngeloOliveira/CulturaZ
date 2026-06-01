import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/feedback/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import {
  useActivateListingMutation,
  usePauseListingMutation,
  useRemoveListingMutation,
  useSellerListingsQuery,
} from '@/hooks/api';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { ListingResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL, formatCondition } from '@/utils/format';

import type { SellerListingsStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<SellerListingsStackParamList, 'MyListings'>;

const STATUS_LABEL: Record<ListingResponse['status'], string> = {
  PENDING_REVIEW: 'Em análise',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  BLOCKED: 'Bloqueado',
  SOLD_OUT: 'Esgotado',
  REMOVED: 'Removido',
};

const STATUS_TONE: Record<ListingResponse['status'], 'success' | 'warning' | 'info' | 'error' | 'neutral'> = {
  PENDING_REVIEW: 'warning',
  ACTIVE: 'success',
  PAUSED: 'neutral',
  BLOCKED: 'error',
  SOLD_OUT: 'info',
  REMOVED: 'neutral',
};

export const MyListingsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const listingsQuery = useSellerListingsQuery({ size: 50 });
  const pauseListing = usePauseListingMutation();
  const activateListing = useActivateListingMutation();
  const removeListing = useRemoveListingMutation();

  const mutating =
    pauseListing.isPending || activateListing.isPending || removeListing.isPending;

  const handleError = (err: unknown, fallback: string) =>
    Alert.alert(fallback, getErrorMessage(err));

  const onPause = (l: ListingResponse) =>
    pauseListing.mutate(l.id, {
      onError: (err) => handleError(err, 'Falha ao pausar'),
    });

  const onActivate = (l: ListingResponse) =>
    activateListing.mutate(l.id, {
      onError: (err) => handleError(err, 'Falha ao reativar'),
    });

  const onRemove = (l: ListingResponse) => {
    Alert.alert('Remover anúncio?', `"${l.book.title}" será removido.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () =>
          removeListing.mutate(l.id, {
            onError: (err) => handleError(err, 'Falha ao remover'),
          }),
      },
    ]);
  };

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
            {formatCondition(item.condition)} · estoque {item.stockQuantity}
          </Text>
          <Text style={styles.price}>{formatBRL(item.price)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {item.status === 'ACTIVE' || item.status === 'PENDING_REVIEW' ? (
          <Pressable
            onPress={() => onPause(item)}
            disabled={mutating}
            style={styles.actionBtn}
            hitSlop={6}
          >
            <Ionicons name="pause-outline" size={16} color={colors.primary} />
            <Text style={styles.actionLabel}>Pausar</Text>
          </Pressable>
        ) : null}
        {item.status === 'PAUSED' ? (
          <Pressable
            onPress={() => onActivate(item)}
            disabled={mutating}
            style={styles.actionBtn}
            hitSlop={6}
          >
            <Ionicons name="play-outline" size={16} color={colors.primary} />
            <Text style={styles.actionLabel}>Reativar</Text>
          </Pressable>
        ) : null}
        {item.status !== 'REMOVED' ? (
          <Pressable
            onPress={() => onRemove(item)}
            disabled={mutating}
            style={styles.actionBtn}
            hitSlop={6}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Text style={[styles.actionLabel, styles.actionLabelDanger]}>Remover</Text>
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
          icon="albums-outline"
          title="Nenhum anúncio publicado"
          description="Toque no botão + para criar o primeiro."
        />
      );
    }
    return (
      <FlatList
        data={items}
        keyExtractor={(l) => l.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={listingsQuery.isRefetching}
        onRefresh={() => listingsQuery.refetch()}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Meus anúncios</Text>
        <Pressable
          onPress={() => navigation.navigate('CreateListing')}
          style={({ pressed }) => [styles.fab, pressed ? { opacity: 0.85 } : null]}
          hitSlop={6}
        >
          <Ionicons name="add" size={22} color={colors.white} />
        </Pressable>
      </View>
      {renderBody()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
