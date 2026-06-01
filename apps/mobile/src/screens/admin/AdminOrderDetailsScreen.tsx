import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/components/buttons/IconButton';
import { Badge } from '@/components/feedback/Badge';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppScreen } from '@/components/layout/AppScreen';
import { useAdminOrderQuery } from '@/hooks/api';
import { colors, radius, spacing, typography } from '@/theme';
import type { OrderStatus } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL, formatOrderStatus } from '@/utils/format';

type Route = RouteProp<{ AdminOrderDetails: { orderId: string } }, 'AdminOrderDetails'>;

const STATUS_TONE: Record<OrderStatus, 'success' | 'warning' | 'info' | 'error' | 'neutral'> = {
  CREATED: 'info',
  WAITING_PAYMENT: 'warning',
  CONFIRMED: 'info',
  IN_PREPARATION: 'info',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
  REFUNDED: 'neutral',
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export const AdminOrderDetailsScreen = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { orderId } = route.params;

  const orderQuery = useAdminOrderQuery(orderId);
  const order = orderQuery.data;

  if (orderQuery.isLoading) {
    return (
      <AppScreen>
        <LoadingState message="Carregando pedido…" />
      </AppScreen>
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <AppScreen>
        <View style={styles.topBar}>
          <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        </View>
        <ErrorState
          title="Pedido não encontrado"
          description={getErrorMessage(orderQuery.error)}
          onRetry={() => orderQuery.refetch()}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Auditoria</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Text style={styles.code}>{order.code}</Text>
          <Badge label={formatOrderStatus(order.status)} tone={STATUS_TONE[order.status]} />
          <Text style={styles.meta}>Criado em {formatDate(order.createdAt)}</Text>
          <Text style={styles.meta}>Comprador: {order.buyerId}</Text>
          <Text style={styles.meta}>Pagamento: {order.paymentStatus}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Itens</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemBody}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.bookTitle}
                </Text>
                <Text style={styles.itemMeta}>
                  {item.quantity}x · {formatBRL(item.unitPrice)} · vendedor {item.sellerId}
                </Text>
              </View>
              <Text style={styles.itemSubtotal}>{formatBRL(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Valores</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Subtotal</Text>
            <Text style={styles.amountValue}>{formatBRL(order.subtotalAmount)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Frete</Text>
            <Text style={styles.amountValue}>{formatBRL(order.shippingAmount)}</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.amountRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatBRL(order.totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>
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
  headerTitle: { ...typography.titleLg, color: colors.textPrimary },
  spacer: { width: 44 },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    alignItems: 'flex-start',
  },
  code: {
    ...typography.titleLg,
    color: colors.primary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  itemBody: { flex: 1 },
  itemTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  itemMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  itemSubtotal: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: { ...typography.body, color: colors.textSecondary },
  amountValue: { ...typography.body, color: colors.textPrimary },
  sep: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  totalLabel: { ...typography.titleSm, color: colors.textPrimary },
  totalValue: { ...typography.titleSm, color: colors.primary },
});
