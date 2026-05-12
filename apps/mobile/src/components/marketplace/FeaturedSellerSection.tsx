import { View, StyleSheet } from 'react-native';

import { SellerCard } from '@/components/cards/SellerCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/theme';
import type { SellerProfile } from '@/types/seller';

interface FeaturedSellerSectionProps {
  seller: SellerProfile;
  onPress?: (seller: SellerProfile) => void;
}

export const FeaturedSellerSection = ({ seller, onPress }: FeaturedSellerSectionProps) => (
  <>
    <SectionHeader eyebrow="LOJA EM DESTAQUE" title="Curadoria da semana" />
    <View style={styles.wrap}>
      <SellerCard seller={seller} onPress={onPress} />
    </View>
  </>
);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
  },
});
