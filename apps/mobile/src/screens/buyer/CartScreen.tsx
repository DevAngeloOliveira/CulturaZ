import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppScreen } from '@/components/layout/AppScreen';
import {
  useCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/hooks/api';
import { useAuthStore } from '@/stores/auth.store';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { CartItemResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL } from '@/utils/format';

import type { HomeStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<HomeStackParamList, 'Cart'>;

interface RowProps {
  item: CartItemResponse;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

const CartItemRow = ({ item, onIncrease, onDecrease, onRemove, disabled }: RowProps) => {
  const { listing, quantity, subtotal } = item;
  const maxReached = quantity >= listing.stockQuantity;

  return (
    <View style={[styles.row, shadows.sm]}>
      {listing.coverImageUrl ? (
        <Image source={{ uri: listing.coverImageUrl }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Ionicons name="book-outline" size={22} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.bodyHeader}>
          <Text style={styles.title} numberOfLines={2}>
            {listing.book.title}
          </Text>
          <Pressable onPress={onRemove} hitSlop={6} disabled={disabled}>
            <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>
        <Text style={styles.seller} numberOfLines={1}>
          {listing.seller.storeName}
        </Text>
        <View style={styles.footer}>
          <View style={styles.stepper}>
            <Pressable
              onPress={onDecrease}
              disabled={disabled}
              style={({ pressed }) => [styles.stepBtn, pressed ? { opacity: 0.7 } : null]}
              hitSlop={6}
            >
              <Ionicons name="remove" size={18} color={colors.primary} />
            </Pressable>
            <Text style={styles.qty}>{quantity}</Text>
            <Pressable
              onPress={onIncrease}
              disabled={disabled || maxReached}
              style={({ pressed }) => [
                styles.stepBtn,
                (disabled || maxReached) ? { opacity: 0.4 } : null,
                pressed ? { opacity: 0.7 } : null,
              ]}
              hitSlop={6}
            >
              <Ionicons name="add" size={18} color={colors.primary} />
            </Pressable>
          </View>
          <Text style={styles.subtotal}>{formatBRL(subtotal)}</Text>
        </View>
      </View>
    </View>
  );
};

export const CartScreen = () => {
  const navigation = useNavigation<Navigation>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const cartQuery = useCartQuery(isAuthenticated);
  const updateItem = useUpdateCartItemMutation();
  const removeItem = useRemoveCartItemMutation();
  const cart = cartQuery.data;

  const onIncrease = (item: CartItemResponse) => {
    if (item.quantity >= item.listing.stockQuantity) return;
    updateItem.mutate({ id: item.id, body: { quantity: item.quantity + 1 } });
  };

  const onDecrease = (item: CartItemResponse) => {
    if (item.quantity <= 1) {
      removeItem.mutate(item.id);
      return;
    }
    updateItem.mutate({ id: item.id, body: { quantity: item.quantity - 1 } });
  };

  const onRemove = (item: CartItemResponse) => {
    removeItem.mutate(item.id);
  };

  const renderBody = () => {
    if (!isAuthenticated) {
      return (
        <EmptyState
          icon="bag-handle-outline"
          title="Entre para comprar"
          description="Faça login para ver o carrinho."
        />
      );
    }
    if (cartQuery.isLoading) return <LoadingState message="Carregando carrinho…" />;
    if (cartQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar"
          description={getErrorMessage(cartQuery.error)}
          onRetry={() => cartQuery.refetch()}
        />
      );
    }
    if (!cart || cart.items.length === 0) {
      return (
        <EmptyState
          icon="bag-handle-outline"
          title="Carrinho vazio"
          description="Adicione livros pelos detalhes de cada anúncio."
        />
      );
    }
    const mutating = updateItem.isPending || removeItem.isPending;
    return (
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrease={() => onIncrease(item)}
            onDecrease={() => onDecrease(item)}
            onRemove={() => onRemove(item)}
            disabled={mutating}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const hasItems = (cart?.items.length ?? 0) > 0;

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Carrinho</Text>
        <View style={styles.spacer} />
      </View>
      {renderBody()}
      {hasItems ? (
        <View style={styles.checkoutBar}>
          <View>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatBRL(cart!.subtotalAmount)}</Text>
          </View>
          <Button
            label="Finalizar pedido"
            onPress={() => navigation.navigate('Checkout')}
          />
        </View>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  spacer: {
    width: 44,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  separator: {
    height: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
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
    justifyContent: 'space-between',
  },
  bodyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    ...typography.titleSm,
    color: colors.textPrimary,
    flex: 1,
  },
  seller: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    ...typography.bodyStrong,
    color: colors.primary,
    minWidth: 16,
    textAlign: 'center',
  },
  subtotal: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  checkoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.titleSm,
    color: colors.primary,
  },
});
