import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader = ({
  title,
  eyebrow,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) => (
  <View style={styles.container}>
    <View style={styles.titleWrap}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
    {actionLabel && onActionPress ? (
      <Pressable onPress={onActionPress} hitSlop={8}>
        <Text style={styles.action}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  titleWrap: {
    flex: 1,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.secondary,
    marginBottom: 2,
  },
  title: {
    ...typography.titleLg,
    color: colors.textPrimary,
  },
  action: {
    ...typography.label,
    color: colors.secondary,
  },
});
