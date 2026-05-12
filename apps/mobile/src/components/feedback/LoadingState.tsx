import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'Carregando…' }: LoadingStateProps) => (
  <View style={styles.container}>
    <ActivityIndicator color={colors.primary} size="large" />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  message: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});
