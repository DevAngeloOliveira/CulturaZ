import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MetricCard } from '@/components/cards/MetricCard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useSellerDashboardQuery } from '@/hooks/api';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL, formatRating } from '@/utils/format';

interface BarSegmentProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const BarSegment = ({ label, value, total, color }: BarSegmentProps) => {
  const pct = total > 0 ? Math.max(0, Math.min(100, (value / total) * 100)) : 0;
  return (
    <View style={segStyles.row}>
      <View style={segStyles.head}>
        <Text style={segStyles.label}>{label}</Text>
        <Text style={segStyles.value}>{value}</Text>
      </View>
      <View style={segStyles.track}>
        <View style={[segStyles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const segStyles = StyleSheet.create({
  row: { gap: 4 },
  head: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...typography.caption, color: colors.textSecondary },
  value: { ...typography.bodyStrong, color: colors.textPrimary },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryMuted,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

export const SellerReportScreen = () => {
  const dashboardQuery = useSellerDashboardQuery();

  if (dashboardQuery.isLoading) {
    return <LoadingState message="Carregando relatório…" />;
  }
  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <ErrorState
        title="Não foi possível carregar"
        description={getErrorMessage(dashboardQuery.error)}
        onRetry={() => dashboardQuery.refetch()}
      />
    );
  }

  const d = dashboardQuery.data;
  const totalListings = d.activeListings + d.pendingListings + d.soldOutListings;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Relatório</Text>
        <Text style={styles.subtitle}>Últimos 30 dias</Text>

        <View style={styles.row}>
          <MetricCard
            label="Receita 30 dias"
            value={formatBRL(d.revenueLast30Days)}
            hint="Soma dos pedidos concluídos."
          />
          <MetricCard label="Vendas 30 dias" value={String(d.salesLast30Days)} />
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.sectionTitle}>Anúncios por status</Text>
          <Text style={styles.sectionHint}>Distribuição relativa de {totalListings} anúncios.</Text>
          <View style={styles.barsBlock}>
            <BarSegment label="Ativos" value={d.activeListings} total={totalListings} color={colors.success} />
            <BarSegment label="Em análise" value={d.pendingListings} total={totalListings} color={colors.warning} />
            <BarSegment label="Esgotados" value={d.soldOutListings} total={totalListings} color={colors.info} />
          </View>
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.sectionTitle}>Pedidos</Text>
          <Text style={styles.sectionHint}>Abertos vs. concluídos no período.</Text>
          <View style={styles.barsBlock}>
            <BarSegment
              label="Abertos"
              value={d.ordersOpen}
              total={d.ordersOpen + d.salesLast30Days}
              color={colors.warning}
            />
            <BarSegment
              label="Concluídos"
              value={d.salesLast30Days}
              total={d.ordersOpen + d.salesLast30Days}
              color={colors.success}
            />
          </View>
        </View>

        <View style={[styles.card, shadows.sm]}>
          <View style={styles.ratingHeader}>
            <Ionicons name="star" size={20} color={colors.accent} />
            <Text style={styles.ratingValue}>{formatRating(d.averageRating)}</Text>
          </View>
          <Text style={styles.sectionHint}>Avaliação média de todos os clientes.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  barsBlock: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingValue: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
});
