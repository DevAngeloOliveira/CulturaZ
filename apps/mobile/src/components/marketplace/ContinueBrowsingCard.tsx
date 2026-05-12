import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '@/components/layout/SectionHeader';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { BookListing } from '@/types/listing';
import { formatBRL } from '@/utils/format';

interface ContinueBrowsingCardProps {
  listing: BookListing;
  onPress?: () => void;
}

export const ContinueBrowsingCard = ({ listing, onPress }: ContinueBrowsingCardProps) => (
  <>
    <SectionHeader title="Continue garimpando" />
    <View style={styles.outer}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, shadows.sm, pressed ? { opacity: 0.92 } : null]}>
        {listing.coverImageUrl ? (
          <Image source={{ uri: listing.coverImageUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={[styles.cover, styles.coverFallback]}>
            <Ionicons name="book-outline" size={26} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.body}>
          <Text style={styles.label}>Você viu há pouco</Text>
          <Text style={styles.title} numberOfLines={2}>
            {listing.book.title}
          </Text>
          <Text style={styles.price}>{formatBRL(listing.price)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </Pressable>
    </View>
  </>
);

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  cover: {
    width: 56,
    height: 80,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  label: {
    ...typography.eyebrow,
    color: colors.secondary,
    marginBottom: 2,
  },
  title: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  price: {
    ...typography.bodyStrong,
    color: colors.primary,
    marginTop: 4,
  },
});
