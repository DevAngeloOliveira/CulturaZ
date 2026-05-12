import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  useEffect(() => {
    const handle = setTimeout(onFinish, 1100);
    return () => clearTimeout(handle);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Cz</Text>
      </View>
      <Text style={styles.brand}>CulturaZ</Text>
      <Text style={styles.tagline}>Marketplace literário</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    ...typography.displayLg,
    color: colors.primary,
  },
  brand: {
    ...typography.titleLg,
    color: colors.white,
  },
  tagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
});
