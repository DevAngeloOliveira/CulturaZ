import { FlatList, StyleSheet } from 'react-native';

import { CategoryCard } from '@/components/cards/CategoryCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/theme';
import type { Category } from '@/types/category';

interface CategoryCarouselProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
  onSeeAll?: () => void;
}

export const CategoryCarousel = ({ categories, onSelect, onSeeAll }: CategoryCarouselProps) => (
  <>
    <SectionHeader title="Categorias" actionLabel="Ver tudo" onActionPress={onSeeAll} />
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CategoryCard category={item} onPress={onSelect} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  </>
);

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
});
