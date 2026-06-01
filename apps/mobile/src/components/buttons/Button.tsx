import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_STYLES: Record<
  ButtonVariant,
  { bg: string; fg: string; border?: string; elevated?: boolean }
> = {
  primary: { bg: colors.primary, fg: colors.white, elevated: true },
  secondary: { bg: colors.mint, fg: colors.primary },
  outline: { bg: colors.white, fg: colors.primary, border: colors.primary },
  ghost: { bg: 'transparent', fg: colors.primary },
  accent: { bg: colors.accent, fg: colors.primary, elevated: true },
};

const SIZE_STYLES: Record<ButtonSize, { paddingV: number; paddingH: number; minHeight: number }> = {
  sm: { paddingV: spacing.xs, paddingH: spacing.md, minHeight: 36 },
  md: { paddingV: spacing.sm, paddingH: spacing.lg, minHeight: 48 },
  lg: { paddingV: spacing.sm + 2, paddingH: spacing.lg, minHeight: 52 },
};

const resolveOpacity = (isDisabled: boolean, pressed: boolean): number => {
  if (isDisabled) return 0.55;
  return pressed ? 0.9 : 1;
};

export const Button = ({
  label,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  fullWidth,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ButtonProps) => {
  const palette = VARIANT_STYLES[variant];
  const sizing = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        palette.elevated && !isDisabled ? styles.elevated : null,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border ?? 'transparent',
          borderWidth: palette.border ? 1 : 0,
          paddingVertical: sizing.paddingV,
          paddingHorizontal: sizing.paddingH,
          minHeight: sizing.minHeight,
          opacity: resolveOpacity(Boolean(isDisabled), pressed),
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <Ionicons name={leftIcon} size={18} color={palette.fg} /> : null}
          <Text style={[styles.label, { color: palette.fg }]} numberOfLines={1}>
            {label}
          </Text>
          {rightIcon ? <Ionicons name={rightIcon} size={18} color={palette.fg} /> : null}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elevated: Platform.select({
    ios: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {},
  }) as ViewStyle,
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.button,
  },
});
