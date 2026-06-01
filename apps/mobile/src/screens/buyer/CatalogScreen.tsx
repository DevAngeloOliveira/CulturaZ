import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/feedback/Badge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { SearchInput } from '@/components/forms/SearchInput';
import { AppScreen } from '@/components/layout/AppScreen';
import { BookListItem } from '@/components/cards/BookListItem';
import { useInfiniteListingsQuery } from '@/hooks/api';
import { useDebounce } from '@/hooks/useDebounce';
import { filterCount, useCatalogStore } from '@/stores/catalog.store';
import { colors, radius, spacing, typography } from '@/theme';
import type { BookListing } from '@/types/listing';
import { toListing } from '@/utils/adapters';
import { getErrorMessage } from '@/utils/apiErrors';

import type { SearchStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<SearchStackParamList, 'Catalog'>;

export const CatalogScreen = () => {
  const navigation = useNavigation<Navigation>();
  const query = useCatalogStore((s) => s.query);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const filters = useCatalogStore((s) => s.filters);

  const debouncedQuery = useDebounce(query, 350);
  const activeFilterCount = filterCount(filters);

  const listingsQuery = useInfiniteListingsQuery({
    q: debouncedQuery || undefined,
    ...filters,
    sort: 'createdAt,desc',
  });

  const listings = useMemo<BookListing[]>(
    () =>
      (listingsQuery.data?.pages ?? [])
        .flatMap((page) => page.items)
        .map((l) => toListing(l)),
    [listingsQuery.data],
  );

  const onEndReached = () => {
    if (listingsQuery.hasNextPage && !listingsQuery.isFetchingNextPage) {
      listingsQuery.fetchNextPage();
    }
  };

  const openDetails = (listing: BookListing) => {
    navigation.navigate('BookDetails', { listingId: listing.id });
  };

  const openFilters = () => navigation.navigate('Filters');

  const renderFooter = () => {
    if (listingsQuery.isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }
    return null;
  };

  const renderBody = () => {
    if (listingsQuery.isLoading) return <LoadingState message="Buscando livros…" />;
    if (listingsQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar o catálogo"
          description={getErrorMessage(listingsQuery.error)}
          onRetry={() => listingsQuery.refetch()}
        />
      );
    }
    if (listings.length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="Nada encontrado"
          description={
            debouncedQuery || activeFilterCount > 0
              ? 'Tente outros termos ou limpe os filtros.'
              : 'Em breve novos anúncios aparecem aqui.'
          }
        />
      );
    }
    return (
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookListItem listing={item} onPress={openDetails} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        refreshing={listingsQuery.isRefetching && !listingsQuery.isFetchingNextPage}
        onRefresh={() => listingsQuery.refetch()}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <AppScreen>
      <View style={styles.header}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          containerStyle={styles.search}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <Pressable onPress={openFilters} style={styles.filterButton} hitSlop={6}>
          <Ionicons name="options-outline" size={22} color={colors.primary} />
          {activeFilterCount > 0 ? (
            <Badge label={String(activeFilterCount)} tone="primary" style={styles.filterBadge} />
          ) : null}
        </Pressable>
      </View>
      {debouncedQuery || activeFilterCount > 0 ? (
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {listingsQuery.data
              ? `${listingsQuery.data.pages[0]?.pagination.total ?? 0} resultado(s)`
              : ''}
          </Text>
          {activeFilterCount > 0 ? (
            <Pressable onPress={() => useCatalogStore.getState().clearFilters()}>
              <Text style={styles.clearLink}>Limpar filtros</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {renderBody()}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  search: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  clearLink: {
    ...typography.label,
    color: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
  footer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
