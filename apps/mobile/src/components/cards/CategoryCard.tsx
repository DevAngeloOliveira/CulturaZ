import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { Category } from '@/types/category';

interface CategoryCardProps {
  category: Category;
  onPress?: (category: Category) => void;
}

export const CategoryCard = ({ category, onPress }: CategoryCardProps) => (
  <Pressable
    onPress={() => onPress?.(category)}
    style={({ pressed }) => [styles.card, shadows.sm, pressed ? { opacity: 0.85 } : null]}
  >
    <View style={styles.iconWrap}>
      <Ionicons
        name={(category.icon as keyof typeof Ionicons.glyphMap) ?? 'book-outline'}
        size={22}
        color={colors.primary}
      />
    </View>
    <Text style={styles.name} numberOfLines={1}>
      {category.name}
    </Text>
    {typeof category.booksCount === 'number' ? (
      <Text style={styles.count}>{category.booksCount.toLocaleString('pt-BR')} livros</Text>
    ) : null}
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    width: 132,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  count: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
