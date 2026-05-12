import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = 'Algo deu errado',
  description = 'Tente novamente em instantes.',
  onRetry,
}: ErrorStateProps) => (
  <View style={styles.container}>
    <Ionicons name="alert-circle-outline" size={36} color={colors.error} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    {onRetry ? (
      <Pressable onPress={onRetry} style={styles.retry}>
        <Text style={styles.retryText}>Tentar novamente</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.titleSm,
    color: colors.textPrimary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryMuted,
  },
  retryText: {
    ...typography.button,
    color: colors.primary,
  },
});
