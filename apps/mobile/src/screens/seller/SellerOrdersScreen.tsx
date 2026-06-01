import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OrderCard } from '@/components/cards/OrderCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useSellerOrdersQuery } from '@/hooks/api';
import { colors, spacing, typography } from '@/theme';
import type { Order } from '@/types/order';
import { toOrder } from '@/utils/adapters';
import { getErrorMessage } from '@/utils/apiErrors';

import type { SellerOrdersStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<SellerOrdersStackParamList, 'SellerOrders'>;

export const SellerOrdersScreen = () => {
  const navigation = useNavigation<Navigation>();
  const ordersQuery = useSellerOrdersQuery({ size: 50 });

  const orders = useMemo<Order[]>(
    () => (ordersQuery.data?.items ?? []).map(toOrder),
    [ordersQuery.data],
  );

  const openDetails = (order: Order) => {
    navigation.navigate('SellerOrderDetails', { orderId: order.id });
  };

  const renderBody = () => {
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
    if (orders.length === 0) {
      return (
        <EmptyState
          icon="cube-outline"
          title="Sem pedidos por aqui"
          description="Quando um comprador fechar um pedido, ele aparece aqui."
        />
      );
    }
    return (
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
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
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Pedidos recebidos</Text>
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
  headerTitle: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
});
