import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MetricCard } from '@/components/cards/MetricCard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useAdminDashboardQuery } from '@/hooks/api';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL } from '@/utils/format';

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

export const AdminReportsScreen = () => {
  const dashboardQuery = useAdminDashboardQuery();

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
  const totalListings = d.activeListingsCount + d.pendingListingsCount;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Relatório</Text>
        <Text style={styles.subtitle}>Visão geral da plataforma</Text>

        <View style={styles.row}>
          <MetricCard
            label="GMV 30 dias"
            value={formatBRL(d.gmvLast30Days)}
            hint="Valor bruto de mercadoria."
          />
          <MetricCard label="Pedidos hoje" value={String(d.ordersTodayCount)} />
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.sectionTitle}>Anúncios</Text>
          <Text style={styles.sectionHint}>
            Distribuição entre ativos e em moderação ({totalListings} no total).
          </Text>
          <View style={styles.barsBlock}>
            <BarSegment
              label="Ativos"
              value={d.activeListingsCount}
              total={totalListings}
              color={colors.success}
            />
            <BarSegment
              label="Em moderação"
              value={d.pendingListingsCount}
              total={totalListings}
              color={colors.warning}
            />
          </View>
        </View>

        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.sectionTitle}>Comunidade</Text>
          <Text style={styles.sectionHint}>
            {d.sellersCount} vendedores ativos entre {d.usersCount} usuários.
          </Text>
          <View style={styles.communityRow}>
            <View style={styles.communityStat}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
              <Text style={styles.communityValue}>{d.usersCount}</Text>
              <Text style={styles.communityLabel}>Usuários</Text>
            </View>
            <View style={styles.communityStat}>
              <Ionicons name="storefront-outline" size={20} color={colors.primary} />
              <Text style={styles.communityValue}>{d.sellersCount}</Text>
              <Text style={styles.communityLabel}>Vendedores</Text>
            </View>
          </View>
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
  communityRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  communityStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primaryMuted,
  },
  communityValue: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  communityLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
