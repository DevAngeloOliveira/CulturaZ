import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, spacing, typography } from '@/theme';

interface QuickActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  onPress?: () => void;
  tone?: 'primary' | 'accent';
}

export const QuickActionCard = ({
  icon,
  label,
  description,
  onPress,
  tone = 'primary',
}: QuickActionCardProps) => {
  const palette = tone === 'accent'
    ? { bg: colors.accentMuted, fg: colors.accent }
    : { bg: colors.primaryMuted, fg: colors.primary };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadows.sm, pressed ? { opacity: 0.9 } : null]}
    >
      <View style={[styles.iconWrap, { backgroundColor: palette.bg }]}>
        <Ionicons name={icon} size={22} color={palette.fg} />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {description ? (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
    minHeight: 92,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.titleSm,
    color: colors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
