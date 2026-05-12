import { StyleSheet, View } from 'react-native';

import { OrderCard } from '@/components/cards/OrderCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/theme';
import type { Order } from '@/types/order';

interface OrderStatusSectionProps {
  orders: Order[];
  onSelect?: (order: Order) => void;
  onSeeAll?: () => void;
}

export const OrderStatusSection = ({ orders, onSelect, onSeeAll }: OrderStatusSectionProps) => {
  if (orders.length === 0) return null;
  return (
    <>
      <SectionHeader
        title="Status dos seus pedidos"
        actionLabel="Ver todos"
        onActionPress={onSeeAll}
      />
      <View style={styles.list}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onPress={onSelect} />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
});
