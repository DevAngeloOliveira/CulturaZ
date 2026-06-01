import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/components/buttons/IconButton';
import { BookListItem } from '@/components/cards/BookListItem';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppScreen } from '@/components/layout/AppScreen';
import { useFavoritesQuery } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth.store';
import { colors, spacing, typography } from '@/theme';
import type { BookListing } from '@/types/listing';
import { toListing } from '@/utils/adapters';
import { getErrorMessage } from '@/utils/apiErrors';

import type { HomeStackParamList } from '@/app/navigation/types';

type Navigation = NativeStackNavigationProp<HomeStackParamList, 'Favorites'>;

export const FavoritesScreen = () => {
  const navigation = useNavigation<Navigation>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const favoritesQuery = useFavoritesQuery(isAuthenticated);

  const favorites = useMemo<BookListing[]>(
    () =>
      (favoritesQuery.data ?? []).map((f) =>
        toListing(f.listing, new Set([f.listing.id])),
      ),
    [favoritesQuery.data],
  );

  const openDetails = (listing: BookListing) => {
    navigation.navigate('BookDetails', { listingId: listing.id });
  };

  const renderBody = () => {
    if (!isAuthenticated) {
      return (
        <EmptyState
          icon="heart-outline"
          title="Entre para favoritar"
          description="Crie uma conta ou faça login para salvar livros."
        />
      );
    }
    if (favoritesQuery.isLoading) return <LoadingState message="Carregando favoritos…" />;
    if (favoritesQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar"
          description={getErrorMessage(favoritesQuery.error)}
          onRetry={() => favoritesQuery.refetch()}
        />
      );
    }
    if (favorites.length === 0) {
      return (
        <EmptyState
          icon="heart-outline"
          title="Sem favoritos ainda"
          description="Toque no coração nos detalhes de um livro para salvar aqui."
        />
      );
    }
    return (
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookListItem listing={item} onPress={openDetails} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={favoritesQuery.isRefetching}
        onRefresh={() => favoritesQuery.refetch()}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <AppScreen>
      <View style={styles.topBar}>
        <IconButton icon="chevron-back" color={colors.primary} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Favoritos</Text>
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
  title: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  spacer: {
    width: 44,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
});
