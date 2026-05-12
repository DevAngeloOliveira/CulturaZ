import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { colors, radius, shadows, spacing, typography } from '@/theme';

interface HeroBannerProps {
  onPrimaryPress?: () => void;
}

export const HeroBanner = ({ onPrimaryPress }: HeroBannerProps) => (
  <View style={[styles.card, shadows.md]}>
    <View style={styles.illustration}>
      <Ionicons name="library" size={56} color={colors.accent} />
      <Ionicons name="book" size={36} color={colors.surface} style={styles.bookOverlay} />
    </View>
    <View style={styles.content}>
      <Text style={styles.eyebrow}>SEMANA DO GARIMPO</Text>
      <Text style={styles.title}>Livros usados até 40% mais baratos</Text>
      <Text style={styles.body}>
        Compare condição, reputação do vendedor e entrega antes de escolher seu próximo livro.
      </Text>
      <Button
        label="Explorar ofertas"
        variant="accent"
        size="md"
        rightIcon="arrow-forward"
        onPress={onPrimaryPress}
        style={styles.cta}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  illustration: {
    width: 110,
    backgroundColor: 'rgba(217, 154, 43, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookOverlay: {
    position: 'absolute',
    bottom: 18,
    right: 14,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.accent,
  },
  title: {
    ...typography.titleMd,
    color: colors.white,
  },
  body: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  cta: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
});
