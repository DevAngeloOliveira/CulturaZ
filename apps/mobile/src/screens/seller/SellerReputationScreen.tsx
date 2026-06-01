import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/components/buttons/IconButton';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppScreen } from '@/components/layout/AppScreen';
import { queryKeys, useSellerProfileQuery, useSellerReputationQuery } from '@/hooks/api';
import { sellersApi } from '@/services/api';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { Review } from '@/types/review';
import { getErrorMessage } from '@/utils/apiErrors';
import { formatRating } from '@/utils/format';

export const SellerReputationScreen = () => {
  const navigation = useNavigation();
  const profileQuery = useSellerProfileQuery();
  const reputationQuery = useSellerReputationQuery();

  const sellerId = profileQuery.data?.id;
  const reviewsQuery = useQuery({
    queryKey: queryKeys.seller.reviews(sellerId ?? ''),
    queryFn: () => sellersApi.getReviews(sellerId as string),
    enabled: Boolean(sellerId),
  });

  const renderBody = () => {
    if (profileQuery.isLoading || reputationQuery.isLoading || reviewsQuery.isLoading) {
      return <LoadingState message="Carregando reputação…" />;
    }
    if (profileQuery.isError || reputationQuery.isError || reviewsQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar"
          description={getErrorMessage(
            profileQuery.error ?? reputationQuery.error ?? reviewsQuery.error,
          )}
          onRetry={() => {
            profileQuery.refetch();
            reputationQuery.refetch();
            reviewsQuery.refetch();
          }}
        />
      );
    }

    const reviews = reviewsQuery.data ?? [];
    const reputation = reputationQuery.data;

    return (
      <FlatList
        data={reviews}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={
          <View style={[styles.summary, shadows.sm]}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={22} color={colors.accent} />
              <Text style={styles.ratingValue}>
                {reputation ? formatRating(reputation.averageRating) : '—'}
              </Text>
            </View>
            <Text style={styles.subLabel}>
              {reputation ? `${reputation.totalReviews} avaliação(ões)` : 'Sem dados ainda.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => <ReviewCard review={item as unknown as Review} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="ribbon-outline"
            title="Sem avaliações ainda"
            description="Cada pedido entregue pode receber uma avaliação."
          />
        }
        contentContainerStyle={styles.list}
        refreshing={reviewsQuery.isRefetching}
        onRefresh={() => {
          reputationQuery.refetch();
          reviewsQuery.refetch();
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Reputação</Text>
        <View style={styles.spacer} />
      </View>
      {renderBody()}
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
  spacer: { width: 44 },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  separator: { height: spacing.sm },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingValue: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  subLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
