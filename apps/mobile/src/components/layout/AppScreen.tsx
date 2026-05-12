import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme';

interface AppScreenProps {
  children: ReactNode;
  edges?: Edge[];
  background?: string;
  style?: StyleProp<ViewStyle>;
}

export const AppScreen = ({
  children,
  edges = ['top', 'left', 'right'],
  background = colors.background,
  style,
}: AppScreenProps) => (
  <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: background }]}>
    <View style={[styles.inner, style]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});
