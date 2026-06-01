import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { Badge } from '@/components/feedback/Badge';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { StatusDot } from '@/components/feedback/StatusDot';
import { AppScreen } from '@/components/layout/AppScreen';
import { useCancelOrderMutation, useOrderQuery } from '@/hooks/api';
import { colors, radius, spacing, typography } from '@/theme';
import type { OrderStatus } from '@/types/api';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL, formatOrderStatus } from '@/utils/format';

import type { OrdersStackParamList } from '@/app/navigation/types';

type Route = RouteProp<{ OrderDetails: { orderId: string } }, 'OrderDetails'>;
type Navigation = NativeStackNavigationProp<OrdersStackParamList, 'OrderDetails'>;

interface TimelineStep {
  status: OrderStatus;
  label: string;
}

const TIMELINE: TimelineStep[] = [
  { status: 'CREATED', label: 'Pedido criado' },
  { status: 'CONFIRMED', label: 'Pagamento confirmado' },
  { status: 'IN_PREPARATION', label: 'Em preparação' },
  { status: 'SHIPPED', label: 'Enviado' },
  { status: 'DELIVERED', label: 'Entregue' },
];

const STATUS_RANK: Record<OrderStatus, number> = {
  CREATED: 0,
  WAITING_PAYMENT: 0,
  CONFIRMED: 1,
  IN_PREPARATION: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: -1,
  REFUNDED: -1,
};

const CANCELLABLE: OrderStatus[] = ['CREATED', 'WAITING_PAYMENT', 'CONFIRMED'];

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

export const OrderDetailsScreen = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation<Navigation>();
  const { orderId } = route.params;

  const orderQuery = useOrderQuery(orderId);
  const cancelOrder = useCancelOrderMutation();
  const order = orderQuery.data;

  const onConfirmCancel = () => {
    cancelOrder.mutate(
      { id: orderId, body: { reason: 'Cancelado pelo comprador' } },
      {
        onError: (err) => Alert.alert('Não foi possível cancelar', getErrorMessage(err)),
      },
    );
  };

  const onCancel = () => {
    Alert.alert('Cancelar pedido?', 'Esta ação não pode ser desfeita.', [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Cancelar pedido', style: 'destructive', onPress: onConfirmCancel },
    ]);
  };

  const onReview = () => {
    if (!order) return;
    const sellerId = order.items[0]?.sellerId;
    if (!sellerId) return;
    navigation.navigate('Review', { orderId: order.id, sellerId });
  };

  const renderTimeline = () => {
    if (!order) return null;
    const rank = STATUS_RANK[order.status];
    return (
      <View style={styles.timeline}>
        {TIMELINE.map((step, idx) => {
          const reached = rank >= idx;
          const isLast = idx === TIMELINE.length - 1;
          return (
            <View key={step.status} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <StatusDot tone={reached ? 'success' : 'neutral'} size={12} />
                {!isLast ? (
                  <View
                    style={[
                      styles.timelineLine,
                      rank > idx ? styles.timelineLineActive : null,
                    ]}
                  />
                ) : null}
              </View>
              <Text
                style={[
                  styles.timelineLabel,
                  reached ? styles.timelineLabelActive : null,
                ]}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
        {order.status === 'CANCELLED' || order.status === 'REFUNDED' ? (
          <View style={styles.timelineBreak}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
            <Text style={styles.timelineBreakText}>
              Pedido {formatOrderStatus(order.status).toLowerCase()}.
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

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

  const canCancel = CANCELLABLE.includes(order.status);
  const canReview = order.status === 'DELIVERED';

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Pedido</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Text style={styles.code}>{order.code}</Text>
          <Badge label={formatOrderStatus(order.status)} tone={STATUS_TONE[order.status]} />
          <Text style={styles.createdAt}>Criado em {formatDate(order.createdAt)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Acompanhamento</Text>
          {renderTimeline()}
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
                  {item.quantity}x · {formatBRL(item.unitPrice)}
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
          <View style={styles.amountSep} />
          <View style={styles.amountRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatBRL(order.totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>

      {canCancel || canReview ? (
        <View style={styles.footer}>
          {canReview ? (
            <Button
              label="Avaliar vendedor"
              fullWidth
              variant="primary"
              leftIcon="star-outline"
              onPress={onReview}
            />
          ) : null}
          {canCancel ? (
            <Button
              label="Cancelar pedido"
              fullWidth
              variant="outline"
              loading={cancelOrder.isPending}
              onPress={onCancel}
            />
          ) : null}
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
  createdAt: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  timeline: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  timelineLeft: {
    alignItems: 'center',
    paddingTop: 4,
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
    marginTop: 2,
  },
  timelineLineActive: {
    backgroundColor: colors.success,
  },
  timelineLabel: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    paddingBottom: spacing.md,
  },
  timelineLabelActive: {
    color: colors.textPrimary,
  },
  timelineBreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  timelineBreakText: {
    ...typography.caption,
    color: colors.error,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  itemBody: {
    flex: 1,
  },
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
  amountLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  amountValue: {
    ...typography.body,
    color: colors.textPrimary,
  },
  amountSep: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  totalLabel: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.titleSm,
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
});
