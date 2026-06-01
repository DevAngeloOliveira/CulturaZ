import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MetricCard } from '@/components/cards/MetricCard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { useAdminDashboardQuery } from '@/hooks/api';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/auth.store';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatBRL } from '@/utils/format';

import type { AdminDashboardStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<AdminDashboardStackParamList, 'Dashboard'>;

export const AdminDashboardScreen = () => {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);
  const dashboardQuery = useAdminDashboardQuery();

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
  };

  const onLeaveAdminView = () => {
    Alert.alert('Sair do modo admin?', 'Você pode retornar a qualquer momento.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => switchRole('CUSTOMER') },
    ]);
  };

  if (dashboardQuery.isLoading) {
    return <LoadingState message="Carregando painel…" />;
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

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={dashboardQuery.isRefetching}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerBody}>
            <Text style={styles.eyebrow}>PAINEL ADMIN</Text>
            <Text style={styles.title}>CulturaZ · Operações</Text>
            <Text style={styles.subtitle}>Olá, {user?.name?.split(' ')[0] ?? 'admin'}</Text>
          </View>
          <Pressable
            onPress={onLeaveAdminView}
            hitSlop={6}
            style={({ pressed }) => [styles.switch, pressed ? { opacity: 0.7 } : null]}
          >
            <Ionicons name="swap-horizontal-outline" size={20} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.row}>
          <MetricCard label="Usuários" value={String(d.usersCount)} />
          <MetricCard label="Vendedores" value={String(d.sellersCount)} />
        </View>
        <View style={styles.row}>
          <MetricCard
            label="Anúncios ativos"
            value={String(d.activeListingsCount)}
          />
          <MetricCard
            label="Em moderação"
            value={String(d.pendingListingsCount)}
            hint="Precisam de aprovação."
          />
        </View>
        <View style={styles.row}>
          <MetricCard label="Pedidos hoje" value={String(d.ordersTodayCount)} />
          <MetricCard label="GMV 30 dias" value={formatBRL(d.gmvLast30Days)} />
        </View>

        <Pressable
          onPress={() => navigation.navigate('AdminOrders')}
          style={({ pressed }) => [styles.linkRow, shadows.sm, pressed ? { opacity: 0.92 } : null]}
        >
          <View style={styles.linkIcon}>
            <Ionicons name="cube-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.linkBody}>
            <Text style={styles.linkTitle}>Auditoria de pedidos</Text>
            <Text style={styles.linkDesc}>Veja todos os pedidos da plataforma.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>

        <View style={[styles.note, shadows.sm]}>
          <Ionicons name="information-circle-outline" size={18} color={colors.secondary} />
          <Text style={styles.noteText}>
            Use as abas para aprovar anúncios, gerenciar usuários e categorias.
          </Text>
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
  title: {
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
  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  noteText: {
    flex: 1,
    ...typography.caption,
    color: colors.textSecondary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkBody: {
    flex: 1,
    gap: 2,
  },
  linkTitle: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  linkDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
