import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MetricCard } from '@/components/cards/MetricCard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useSellerDashboardQuery, useSellerProfileQuery } from '@/hooks/api';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/auth.store';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL, formatRating } from '@/utils/format';

import type { SellerDashboardStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<SellerDashboardStackParamList, 'Dashboard'>;

export const SellerDashboardScreen = () => {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);

  const profileQuery = useSellerProfileQuery();
  const dashboardQuery = useSellerDashboardQuery();

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['seller'] });
  };

  const onLeaveSellerView = () => {
    Alert.alert('Voltar para o modo comprador?', 'Você pode retornar a qualquer momento.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Voltar', onPress: () => switchRole('CUSTOMER') },
    ]);
  };

  if (profileQuery.isLoading || dashboardQuery.isLoading) {
    return <LoadingState message="Carregando painel…" />;
  }

  if (profileQuery.isError || dashboardQuery.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar"
        description={getErrorMessage(profileQuery.error ?? dashboardQuery.error)}
        onRetry={() => {
          profileQuery.refetch();
          dashboardQuery.refetch();
        }}
      />
    );
  }

  const dash = dashboardQuery.data;
  const profile = profileQuery.data;
  const isRefreshing = profileQuery.isRefetching || dashboardQuery.isRefetching;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerBody}>
            <Text style={styles.eyebrow}>PAINEL DO VENDEDOR</Text>
            <Text style={styles.storeName}>{profile?.storeName ?? 'Sua loja'}</Text>
            <Text style={styles.subtitle}>
              Olá, {user?.name?.split(' ')[0] ?? 'vendedor'} ·{' '}
              {profile?.status === 'ACTIVE'
                ? 'Ativa'
                : profile?.status === 'PENDING_REVIEW'
                  ? 'Em análise'
                  : 'Suspensa'}
            </Text>
          </View>
          <Pressable
            onPress={onLeaveSellerView}
            hitSlop={6}
            style={({ pressed }) => [styles.switch, pressed ? { opacity: 0.7 } : null]}
          >
            <Ionicons name="swap-horizontal-outline" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {dash ? (
          <>
            <View style={styles.row}>
              <MetricCard label="Anúncios ativos" value={String(dash.activeListings)} />
              <MetricCard
                label="Pendentes"
                value={String(dash.pendingListings)}
                hint="Aguardando moderação."
              />
            </View>
            <View style={styles.row}>
              <MetricCard label="Esgotados" value={String(dash.soldOutListings)} />
              <MetricCard
                label="Pedidos abertos"
                value={String(dash.ordersOpen)}
                hint="Precisam de atenção."
              />
            </View>
            <View style={styles.row}>
              <MetricCard
                label="Vendas 30 dias"
                value={String(dash.salesLast30Days)}
                hint="Pedidos concluídos."
              />
              <MetricCard
                label="Receita 30 dias"
                value={formatBRL(dash.revenueLast30Days)}
              />
            </View>

            <Pressable
              onPress={() => navigation.navigate('Reputation')}
              style={({ pressed }) => [styles.reputation, shadows.sm, pressed ? { opacity: 0.92 } : null]}
            >
              <View style={styles.reputationLeft}>
                <Ionicons name="ribbon-outline" size={22} color={colors.accent} />
                <View>
                  <Text style={styles.reputationLabel}>Reputação</Text>
                  <Text style={styles.reputationValue}>
                    {formatRating(dash.averageRating)} · veja avaliações
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerBody: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.secondary,
  },
  storeName: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  switch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reputation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  reputationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  reputationLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  reputationValue: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
});
