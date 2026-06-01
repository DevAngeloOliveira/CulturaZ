import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { OrderCard } from '@/components/cards/OrderCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppScreen } from '@/components/layout/AppScreen';
import { useMyOrdersQuery } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth.store';
import { colors, radius, spacing, typography } from '@/theme';
import type { OrderStatus } from '@/types/api';
import type { Order } from '@/types/order';
import { toOrder } from '@/utils/adapters';
import { getErrorMessage } from '@/utils/apiErrors';

import type { OrdersStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<OrdersStackParamList, 'MyOrders'>;

type Tab = 'all' | 'open' | 'delivered';

const TABS: { value: Tab; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Em andamento' },
  { value: 'delivered', label: 'Entregues' },
];

const OPEN_STATUSES: OrderStatus[] = [
  'CREATED',
  'WAITING_PAYMENT',
  'CONFIRMED',
  'IN_PREPARATION',
  'SHIPPED',
];

const matchesTab = (status: OrderStatus, tab: Tab): boolean => {
  if (tab === 'all') return true;
  if (tab === 'open') return OPEN_STATUSES.includes(status);
  return status === 'DELIVERED';
};

export const MyOrdersScreen = () => {
  const navigation = useNavigation<Navigation>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [tab, setTab] = useState<Tab>('all');

  const ordersQuery = useMyOrdersQuery({ size: 50 }, isAuthenticated);

  const orders = useMemo<Order[]>(
    () => (ordersQuery.data?.items ?? []).map(toOrder),
    [ordersQuery.data],
  );

  const filtered = useMemo(() => orders.filter((o) => matchesTab(o.status, tab)), [orders, tab]);

  const openDetails = (order: Order) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
  };

  const renderBody = () => {
    if (!isAuthenticated) {
      return (
        <EmptyState
          icon="cube-outline"
          title="Entre para ver seus pedidos"
          description="Faça login para acompanhar suas compras."
        />
      );
    }
    if (ordersQuery.isLoading) return <LoadingState message="Carregando pedidos…" />;
    if (ordersQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar"
          description={getErrorMessage(ordersQuery.error)}
          onRetry={() => ordersQuery.refetch()}
        />
      );
    }
    if (filtered.length === 0) {
      return (
        <EmptyState
          icon="cube-outline"
          title="Nenhum pedido por aqui"
          description={
            tab === 'all'
              ? 'Quando você fizer uma compra, ela aparece aqui.'
              : 'Nenhum pedido nesta categoria.'
          }
        />
      );
    }
    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} onPress={openDetails} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        refreshing={ordersQuery.isRefetching}
        onRefresh={() => ordersQuery.refetch()}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Meus pedidos</Text>
      </View>
      <View style={styles.tabs}>
        {TABS.map((t) => {
          const active = t.value === tab;
          return (
            <Pressable
              key={t.value}
              onPress={() => setTab(t.value)}
              style={[styles.tab, active ? styles.tabActive : null]}
            >
              <Text style={[styles.tabLabel, active ? styles.tabLabelActive : null]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {renderBody()}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.white,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
});
