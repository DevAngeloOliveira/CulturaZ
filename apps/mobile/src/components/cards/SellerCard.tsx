import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/feedback/Badge';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { SellerProfile } from '@/types/seller';
import { formatRating } from '@/utils/format';

interface SellerCardProps {
  seller: SellerProfile;
  onPress?: (seller: SellerProfile) => void;
}

const sellerTypeLabel: Record<SellerProfile['type'], string> = {
  INDIVIDUAL: 'Vendedor individual',
  BOOKSTORE: 'Livraria',
  SEBO: 'Sebo',
};

export const SellerCard = ({ seller, onPress }: SellerCardProps) => (
  <Pressable
    onPress={() => onPress?.(seller)}
    style={({ pressed }) => [styles.card, shadows.sm, pressed ? { opacity: 0.92 } : null]}
  >
    <View style={styles.headerRow}>
      <View style={styles.avatar}>
        <Ionicons name="storefront-outline" size={22} color={colors.primary} />
      </View>
      <View style={styles.headerText}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {seller.storeName}
          </Text>
          {seller.isVerified ? (
            <Ionicons name="checkmark-circle" size={16} color={colors.secondary} />
          ) : null}
        </View>
        <Text style={styles.type}>{sellerTypeLabel[seller.type]}</Text>
      </View>
    </View>

    {seller.description ? (
      <Text style={styles.description} numberOfLines={2}>
        {seller.description}
      </Text>
    ) : null}

    <View style={styles.statsRow}>
      <View style={styles.stat}>
        <Ionicons name="star" size={14} color={colors.accent} />
        <Text style={styles.statText}>{formatRating(seller.rating)} de avaliação</Text>
      </View>
      <View style={styles.stat}>
        <Ionicons name="library-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.statText}>{seller.activeListingsCount} anúncios</Text>
      </View>
    </View>

    {seller.isVerified ? (
      <Badge label="Loja verificada" tone="neutral" style={styles.badge} />
    ) : null}
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.titleMd,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  type: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  badge: {
    marginTop: spacing.xs,
  },
});
