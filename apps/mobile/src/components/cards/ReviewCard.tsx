import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review;
}

/**
 * Placeholder: usado no perfil público do vendedor (entrega 7).
 */
export const ReviewCard = ({ review }: ReviewCardProps) => (
  <View style={[styles.card, shadows.sm]}>
    <View style={styles.headerRow}>
      <Text style={styles.author}>{review.reviewerName}</Text>
      <View style={styles.rating}>
        <Ionicons name="star" size={14} color={colors.accent} />
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>
    </View>
    {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  author: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  comment: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
