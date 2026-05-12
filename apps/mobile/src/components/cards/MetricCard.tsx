import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/theme';

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Placeholder: será usado no dashboard do vendedor (entrega 5) e do admin (entrega 6).
 */
export const MetricCard = ({ label, value, hint, style }: MetricCardProps) => (
  <View style={[styles.card, shadows.sm, style]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
    {hint ? <Text style={styles.hint}>{hint}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  value: {
    ...typography.titleLg,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
