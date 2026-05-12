import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

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
import { categoriesMock } from '@/mocks/categories.mock';
import { listingsMock } from '@/mocks/listings.mock';
import { ordersMock } from '@/mocks/orders.mock';
import { sellersMock } from '@/mocks/sellers.mock';
import { colors, spacing } from '@/theme';

const chipOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'deals', label: 'Ofertas' },
  { value: 'academicos', label: 'Acadêmicos' },
  { value: 'sebos', label: 'Sebos' },
  { value: 'novidades', label: 'Novidades' },
];

const featuredSeller = sellersMock[0]!;
const continueBrowsingListing = listingsMock[0]!;
const flashOffers = listingsMock.filter((l) => l.discountPercentage && l.discountPercentage >= 30);
const recommended = listingsMock.filter((l) => !flashOffers.includes(l));

export const MarketplaceHomeScreen = () => {
  const [chip, setChip] = useState('all');

  const quickActions = [
    { id: 'sell',     icon: 'pricetag-outline' as const,     label: 'Anunciar livro',  description: 'Em poucos minutos.', tone: 'accent' as const },
    { id: 'orders',   icon: 'bag-check-outline' as const,    label: 'Meus pedidos',    description: 'Status em tempo real.' },
    { id: 'favs',     icon: 'heart-outline' as const,        label: 'Favoritos',       description: 'Acompanhe preços.' },
    { id: 'stores',   icon: 'storefront-outline' as const,   label: 'Lojas confiáveis', description: 'Curadoria por região.' },
  ];

  return (
    <View style={styles.root}>
      <MarketplaceHeader cartCount={2} favoritesCount={5} city="São Paulo, SP" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SelectChipGroup options={chipOptions} value={chip} onChange={setChip} />
        <HeroBanner />
        <CategoryCarousel categories={categoriesMock} />
        <QuickActionsGrid actions={quickActions} />
        <FlashOffersSection listings={flashOffers} />
        <ContinueBrowsingCard listing={continueBrowsingListing} />
        <FeaturedSellerSection seller={featuredSeller} />
        <RecommendedBooksSection listings={recommended} />
        <SellerCallToAction />
        <OrderStatusSection orders={ordersMock} />
      </ScrollView>
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
