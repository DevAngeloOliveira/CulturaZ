import { FlatList, StyleSheet } from 'react-native';

import { BookCard } from '@/components/cards/BookCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/theme';
import type { BookListing } from '@/types/listing';

interface FlashOffersSectionProps {
  listings: BookListing[];
  onSelect?: (listing: BookListing) => void;
  onSeeAll?: () => void;
}

export const FlashOffersSection = ({ listings, onSelect, onSeeAll }: FlashOffersSectionProps) => (
  <>
    <SectionHeader
      eyebrow="OFERTAS RELÂMPAGO"
      title="Garimpo de hoje"
      actionLabel="Ver tudo"
      onActionPress={onSeeAll}
    />
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BookCard listing={item} onPress={onSelect} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  </>
);

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
});
