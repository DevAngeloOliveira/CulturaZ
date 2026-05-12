import { FlatList, StyleSheet } from 'react-native';

import { BookCard } from '@/components/cards/BookCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/theme';
import type { BookListing } from '@/types/listing';

interface RecommendedBooksSectionProps {
  listings: BookListing[];
  onSelect?: (listing: BookListing) => void;
  onSeeAll?: () => void;
}

export const RecommendedBooksSection = ({
  listings,
  onSelect,
  onSeeAll,
}: RecommendedBooksSectionProps) => (
  <>
    <SectionHeader title="Pra você" actionLabel="Ver mais" onActionPress={onSeeAll} />
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
