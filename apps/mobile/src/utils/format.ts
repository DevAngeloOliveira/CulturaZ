import type { Money } from '@/types/common';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatBRL = (money: Money | number | undefined): string => {
  if (money === undefined || money === null) return '—';
  const value = typeof money === 'number' ? money : Number.parseFloat(money);
  if (Number.isNaN(value)) return '—';
  return brl.format(value);
};

export const formatRating = (rating: number): string => rating.toFixed(1).replace('.', ',');

export const discountPercent = (price: Money, originalPrice?: Money): number | null => {
  if (!originalPrice) return null;
  const p = Number.parseFloat(price);
  const o = Number.parseFloat(originalPrice);
  if (Number.isNaN(p) || Number.isNaN(o) || o <= 0 || p >= o) return null;
  return Math.round((1 - p / o) * 100);
};

const orderStatusLabels: Record<string, string> = {
  CREATED: 'Pedido criado',
  WAITING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Pagamento confirmado',
  IN_PREPARATION: 'Em preparação',
  SHIPPED: 'Pedido enviado',
  DELIVERED: 'Pedido entregue',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export const formatOrderStatus = (status: string): string =>
  orderStatusLabels[status] ?? status;

const conditionLabels: Record<string, string> = {
  NEW: 'Novo',
  LIKE_NEW: 'Seminovo',
  GOOD: 'Bom',
  FAIR: 'Regular',
  DAMAGED: 'Desgastado',
};

export const formatCondition = (condition: string): string =>
  conditionLabels[condition] ?? condition;
