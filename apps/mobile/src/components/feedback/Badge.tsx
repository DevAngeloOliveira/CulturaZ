import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type BadgeTone = 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  primary: { bg: colors.primary, fg: colors.white },
  accent: { bg: colors.accent, fg: colors.primary },
  success: { bg: colors.success, fg: colors.white },
  warning: { bg: colors.warning, fg: colors.primary },
  error: { bg: colors.error, fg: colors.white },
  info: { bg: colors.info, fg: colors.white },
  neutral: { bg: colors.primaryMuted, fg: colors.primary },
};

export const Badge = ({ label, tone = 'primary', style }: BadgeProps) => {
  const palette = TONES[tone];
  return (
    <View style={[styles.container, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.label, { color: palette.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
  },
});
