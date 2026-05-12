import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { colors, radius, shadows, spacing, typography } from '@/theme';

interface SellerCallToActionProps {
  onPress?: () => void;
}

export const SellerCallToAction = ({ onPress }: SellerCallToActionProps) => (
  <View style={styles.outer}>
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.iconWrap}>
        <Ionicons name="cash-outline" size={26} color={colors.accent} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Tem livros parados?</Text>
        <Text style={styles.description}>
          Revenda em poucos minutos e ganhe espaço na estante. Você define o preço, nós cuidamos da
          vitrine.
        </Text>
        <Button label="Quero vender" variant="primary" size="md" onPress={onPress} style={styles.cta} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    ...typography.titleMd,
    color: colors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cta: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
});
