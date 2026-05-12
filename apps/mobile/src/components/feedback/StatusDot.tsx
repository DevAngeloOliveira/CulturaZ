import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusDotProps {
  tone: StatusTone;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const TONE_COLORS: Record<StatusTone, string> = {
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
  neutral: colors.textSecondary,
};

export const StatusDot = ({ tone, size = 8, style }: StatusDotProps) => (
  <View
    style={[
      styles.dot,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: TONE_COLORS[tone] },
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  dot: {
    alignSelf: 'center',
  },
});
