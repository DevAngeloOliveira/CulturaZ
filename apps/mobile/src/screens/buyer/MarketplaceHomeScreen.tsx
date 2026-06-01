import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import type { HomeStackParamList } from '@/app/navigation/types';
import type { BookListing } from '@/types/listing';
import type { Order } from '@/types/order';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { SelectChipGroup } from '@/components/forms/SelectChipGroup';
import { CategoryCarousel } from '@/components/marketplace/CategoryCarousel';
import { ContinueBrowsingCard } from '@/components/marketplace/ContinueBrowsingCard';
import { FeaturedSellerSection } from '@/components/marketplace/FeaturedSellerSection';
import { FlashOffersSection } from '@/components/marketplace/FlashOffersSection';
import { HeroBanner } from '@/components/marketplace/HeroBanner';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { OrderStatusSection } from '@/components/marketplace/OrderStatusSection';
import { QuickActionsGrid } from '@/components/marketplace/QuickActionsGrid';
import { RecommendedBooksSection } from '@/components/marketplace/RecommendedBooksSection';
import { SellerCallToAction } from '@/components/marketplace/SellerCallToAction';
import {
  queryKeys,
  useCartQuery,
  useCategoriesQuery,
  useFavoritesQuery,
  useListingsQuery,
  useMyOrdersQuery,
} from '@/hooks/api';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/auth.store';
import { colors, spacing } from '@/theme';
import { toCategory, toListing, toOrder } from '@/utils/adapters';
import { getErrorMessage } from '@/utils/apiErrors';

const chipOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'deals', label: 'Ofertas' },
  { value: 'academicos', label: 'Acadêmicos' },
  { value: 'sebos', label: 'Sebos' },
  { value: 'novidades', label: 'Novidades' },
];

const quickActions = [
  { id: 'sell',   icon: 'pricetag-outline'    as const, label: 'Anunciar livro',  description: 'Em poucos minutos.',    tone: 'accent' as const },
  { id: 'orders', icon: 'bag-check-outline'   as const, label: 'Meus pedidos',    description: 'Status em tempo real.' },
  { id: 'favs',   icon: 'heart-outline'       as const, label: 'Favoritos',       description: 'Acompanhe preços.'      },
  { id: 'stores', icon: 'storefront-outline'  as const, label: 'Lojas confiáveis', description: 'Curadoria por região.' },
];

type Navigation = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const MarketplaceHomeScreen = () => {
  const navigation = useNavigation<Navigation>();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [chip, setChip] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const openDetails = (listing: BookListing) => {
    navigation.navigate('BookDetails', { listingId: listing.id });
  };
  const openFavorites = () => navigation.navigate('Favorites');
  const openCart = () => navigation.navigate('Cart');
  const openOrderDetails = (order: Order) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
  };

  const categoriesQuery = useCategoriesQuery();
  const listingsQuery = useListingsQuery({ size: 12, sort: 'createdAt,desc' });
  const favoritesQuery = useFavoritesQuery(isAuthenticated);
  const cartQuery = useCartQuery(isAuthenticated);
  const ordersQuery = useMyOrdersQuery({ size: 1 }, isAuthenticated);

  const favoriteIds = useMemo(
    () => new Set((favoritesQuery.data ?? []).map((f) => f.listing.id)),
    [favoritesQuery.data],
  );

  const categories = useMemo(
    () => (categoriesQuery.data ?? []).filter((c) => c.active).map(toCategory),
    [categoriesQuery.data],
  );

  const listings = useMemo(
    () => (listingsQuery.data?.items ?? []).map((l) => toListing(l, favoriteIds)),
    [listingsQuery.data, favoriteIds],
  );

  const flashOffers = useMemo(
    () => listings.filter((l) => (l.discountPercentage ?? 0) >= 20),
    [listings],
  );
  const recommended = useMemo(
    () => listings.filter((l) => !flashOffers.includes(l)),
    [listings, flashOffers],
  );

  const featuredSeller = listings[0]?.seller;
  const continueBrowsing = listings[0];
  const lastOrder = ordersQuery.data?.items[0];
  const orders = lastOrder ? [toOrder(lastOrder)] : [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
        queryClient.invalidateQueries({ queryKey: queryKeys.listings.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.favorites }),
        queryClient.invalidateQueries({ queryKey: queryKeys.cart }),
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const tagline = user?.name ? `Olá, ${user.name.split(' ')[0]}` : 'Marketplace literário';

  const isFirstLoad =
    listingsQuery.isLoading &&
    categoriesQuery.isLoading &&
    !listingsQuery.data &&
    !categoriesQuery.data;

  const renderCategories = () => {
    if (categoriesQuery.isError) {
      return (
        <ErrorState
          title="Não foi possível carregar as categorias"
          description={getErrorMessage(categoriesQuery.error)}
          onRetry={() => categoriesQuery.refetch()}
        />
      );
    }
    if (categories.length === 0) return null;
    return <CategoryCarousel categories={categories} />;
  };

  const renderListingsBody = () => {
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
          icon="book-outline"
          title="Sem anúncios por aqui"
          description="Volte em breve — novos livros são publicados todo dia."
        />
      );
    }
    return (
      <>
        {flashOffers.length > 0 ? (
          <FlashOffersSection listings={flashOffers} onSelect={openDetails} />
        ) : null}
        {continueBrowsing ? (
          <ContinueBrowsingCard
            listing={continueBrowsing}
            onPress={() => openDetails(continueBrowsing)}
          />
        ) : null}
        {featuredSeller ? <FeaturedSellerSection seller={featuredSeller} /> : null}
        {recommended.length > 0 ? (
          <RecommendedBooksSection listings={recommended} onSelect={openDetails} />
        ) : null}
      </>
    );
  };

  return (
    <View style={styles.root}>
      <MarketplaceHeader
        cartCount={cartQuery.data?.itemsCount ?? 0}
        favoritesCount={favoritesQuery.data?.length ?? 0}
        tagline={tagline}
        onFavoritesPress={openFavorites}
        onCartPress={openCart}
      />

      {isFirstLoad ? (
        <LoadingState message="Carregando o garimpo do dia…" />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <SelectChipGroup options={chipOptions} value={chip} onChange={setChip} />
          <HeroBanner />
          {renderCategories()}
          <QuickActionsGrid actions={quickActions} />
          {renderListingsBody()}
          <SellerCallToAction />
          <OrderStatusSection orders={orders} onSelect={openOrderDetails} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingVertical: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
