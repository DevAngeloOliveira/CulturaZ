import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { SelectChip } from '@/components/forms/SelectChip';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors, fontFamily, radius, spacing, typography } from '@/theme';

interface OnboardingScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const INTERESTS = ['Acadêmicos', 'Literatura', 'Sebos'];

export const OnboardingScreen = ({ onGetStarted, onSignIn }: OnboardingScreenProps) => {
  const [interest, setInterest] = useState(INTERESTS[0]);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroBlobTeal} />
          <View style={styles.heroBlobAmber} />
          <Text style={styles.heroText}>Garimpe{'\n'}livros</Text>
        </View>

        <Text style={styles.heading}>Encontre obras novas e usadas perto de você.</Text>
        <Text style={styles.body}>
          Compare preços, condições e vendedores em uma experiência simples, acolhedora e
          segura.
        </Text>

        <View style={styles.chips}>
          {INTERESTS.map((item) => (
            <SelectChip
              key={item}
              label={item}
              selected={interest === item}
              onPress={() => setInterest(item)}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <Button label="Começar agora" fullWidth onPress={onGetStarted} />
          <Button label="Já tenho conta" variant="outline" fullWidth onPress={onSignIn} />
        </View>
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  hero: {
    height: 205,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    padding: spacing.lg,
    justifyContent: 'flex-end',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 15,
    elevation: 8,
  },
  heroBlobTeal: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.secondary,
    right: -90,
    bottom: -70,
    opacity: 0.85,
  },
  heroBlobAmber: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accent,
    right: -100,
    bottom: -110,
    opacity: 0.95,
  },
  heroText: {
    fontFamily: fontFamily.inter600,
    fontSize: 34,
    lineHeight: 40,
    color: colors.white,
  },
  heading: {
    fontFamily: fontFamily.frauncesRegular,
    fontSize: 30,
    lineHeight: 35,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actions: {
    marginTop: 'auto',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
});
