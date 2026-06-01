import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  useFonts as useFraunces,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_900Black,
  useFonts as useInter,
} from '@expo-google-fonts/inter';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

interface FontProviderProps {
  children: ReactNode;
}

export const FontProvider = ({ children }: FontProviderProps) => {
  const [fraunces] = useFraunces({
    Fraunces_400Regular,
    Fraunces_500Medium,
  });
  const [inter] = useInter({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_900Black,
  });

  if (!fraunces || !inter) {
    return (
      <View style={styles.fallback}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
