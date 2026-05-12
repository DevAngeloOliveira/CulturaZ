import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, typography } from '@/theme';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState = ({
  title,
  description,
  icon = 'cafe-outline',
  style,
}: EmptyStateProps) => (
  <View style={[styles.container, style]}>
    <Ionicons name={icon} size={36} color={colors.textSecondary} />
    <Text style={styles.title}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
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
});
