import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/buttons/IconButton';
import { SearchInput } from '@/components/forms/SearchInput';
import { colors, spacing, typography } from '@/theme';

interface MarketplaceHeaderProps {
  cartCount?: number;
  favoritesCount?: number;
  city?: string;
  onSearchPress?: () => void;
  onCartPress?: () => void;
  onFavoritesPress?: () => void;
}

export const MarketplaceHeader = ({
  cartCount = 0,
  favoritesCount = 0,
  city = 'São Paulo, SP',
  onCartPress,
  onFavoritesPress,
}: MarketplaceHeaderProps) => (
  <SafeAreaView edges={['top']} style={styles.safe}>
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Cz</Text>
          </View>
          <View>
            <Text style={styles.brand}>CulturaZ</Text>
            <Text style={styles.tagline}>Marketplace literário</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon="heart-outline"
            color={colors.white}
            badgeCount={favoritesCount}
            onPress={onFavoritesPress}
          />
          <IconButton
            icon="bag-handle-outline"
            color={colors.white}
            badgeCount={cartCount}
            onPress={onCartPress}
          />
        </View>
      </View>

      <View style={styles.searchWrap}>
        <SearchInput background="rgba(255,255,255,0.12)" />
      </View>

      <View style={styles.location}>
        <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.7)" />
        <Text style={styles.locationText} numberOfLines={1}>
          Entregar ou retirar em {city}
        </Text>
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.primary,
  },
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm + 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...typography.titleMd,
    color: colors.primary,
  },
  brand: {
    ...typography.titleMd,
    color: colors.white,
  },
  tagline: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  searchWrap: {
    marginTop: spacing.xs,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    flexShrink: 1,
  },
});
