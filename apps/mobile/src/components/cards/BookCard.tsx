import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Badge } from '@/components/feedback/Badge';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { BookListing } from '@/types/listing';
import { formatBRL, formatRating } from '@/utils/format';

interface BookCardProps {
  listing: BookListing;
  onPress?: (listing: BookListing) => void;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export const BookCard = ({ listing, onPress, width = 168, style }: BookCardProps) => {
  const usedTone = listing.condition !== 'NEW';

  return (
    <Pressable
      onPress={() => onPress?.(listing)}
      style={({ pressed }) => [
        styles.card,
        shadows.sm,
        { width, opacity: pressed ? 0.92 : 1 },
        style,
      ]}
    >
      <View style={styles.coverWrap}>
        {listing.coverImageUrl ? (
          <Image source={{ uri: listing.coverImageUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={[styles.cover, styles.coverFallback]}>
            <Ionicons name="book-outline" size={32} color={colors.textSecondary} />
          </View>
        )}
        {listing.discountPercentage ? (
          <Badge label={`-${listing.discountPercentage}%`} tone="accent" style={styles.discount} />
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {listing.book.author}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: usedTone ? colors.usedPrice : colors.primary }]}>
            {formatBRL(listing.price)}
          </Text>
          {listing.originalPrice ? (
            <Text style={styles.priceOriginal}>{formatBRL(listing.originalPrice)}</Text>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="star" size={12} color={colors.accent} />
          <Text style={styles.metaText}>{formatRating(listing.seller.rating)}</Text>
          <Text style={styles.metaText}>·</Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {listing.seller.storeName}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  coverWrap: {
    aspectRatio: 0.78,
    backgroundColor: colors.background,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  discount: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  body: {
    padding: spacing.sm + 2,
    gap: 4,
  },
  title: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  author: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginTop: 4,
  },
  price: {
    ...typography.bodyStrong,
  },
  priceOriginal: {
    ...typography.caption,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },
});
