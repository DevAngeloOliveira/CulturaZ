import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { BookListing } from '@/types/listing';
import { formatBRL, formatCondition, formatRating } from '@/utils/format';

interface BookListItemProps {
  listing: BookListing;
  onPress?: (listing: BookListing) => void;
}

export const BookListItem = ({ listing, onPress }: BookListItemProps) => (
  <Pressable
    onPress={() => onPress?.(listing)}
    style={({ pressed }) => [styles.row, shadows.sm, pressed ? { opacity: 0.92 } : null]}
  >
    {listing.coverImageUrl ? (
      <Image source={{ uri: listing.coverImageUrl }} style={styles.cover} resizeMode="cover" />
    ) : (
      <View style={[styles.cover, styles.fallback]}>
        <Ionicons name="book-outline" size={24} color={colors.textSecondary} />
      </View>
    )}
    <View style={styles.body}>
      <Text style={styles.title} numberOfLines={2}>
        {listing.book.title}
      </Text>
      <Text style={styles.author} numberOfLines={1}>
        {listing.book.author}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {formatCondition(listing.condition)} · {listing.seller.storeName}
      </Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatBRL(listing.price)}</Text>
        <View style={styles.rating}>
          <Ionicons name="star" size={12} color={colors.accent} />
          <Text style={styles.ratingText}>{formatRating(listing.seller.rating)}</Text>
        </View>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.md,
  },
  cover: {
    width: 72,
    height: 100,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  author: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
