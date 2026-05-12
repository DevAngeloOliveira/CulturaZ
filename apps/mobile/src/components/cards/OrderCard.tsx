import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusDot } from '@/components/feedback/StatusDot';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { Order, OrderStatus } from '@/types/order';
import { formatBRL, formatOrderStatus } from '@/utils/format';

interface OrderCardProps {
  order: Order;
  onPress?: (order: Order) => void;
}

const TONE_BY_STATUS: Record<OrderStatus, 'success' | 'warning' | 'info' | 'error' | 'neutral'> = {
  CREATED: 'info',
  WAITING_PAYMENT: 'warning',
  CONFIRMED: 'info',
  IN_PREPARATION: 'info',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
  REFUNDED: 'neutral',
};

export const OrderCard = ({ order, onPress }: OrderCardProps) => {
  const tone = TONE_BY_STATUS[order.status];
  const firstItem = order.items[0];

  return (
    <Pressable
      onPress={() => onPress?.(order)}
      style={({ pressed }) => [styles.card, shadows.sm, pressed ? { opacity: 0.92 } : null]}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="cube-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.body}>
          <Text style={styles.code}>{order.code}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {firstItem ? firstItem.bookTitle : 'Pedido'}
          </Text>
          <View style={styles.statusRow}>
            <StatusDot tone={tone} />
            <Text style={styles.statusLabel}>{formatOrderStatus(order.status)}</Text>
          </View>
        </View>
        <Text style={styles.total}>{formatBRL(order.totalAmount)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  code: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  title: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  statusLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  total: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
});
