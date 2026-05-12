import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, touchTarget, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
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
  { bg: string; fg: string; border?: string }
> = {
  primary: { bg: colors.primary, fg: colors.white },
  secondary: { bg: colors.surface, fg: colors.primary, border: colors.primary },
  ghost: { bg: 'transparent', fg: colors.primary },
  accent: { bg: colors.accent, fg: colors.primary },
};

const SIZE_STYLES: Record<ButtonSize, { paddingV: number; paddingH: number; minHeight: number }> = {
  sm: { paddingV: spacing.xs, paddingH: spacing.md, minHeight: 36 },
  md: { paddingV: spacing.sm, paddingH: spacing.lg, minHeight: touchTarget },
  lg: { paddingV: spacing.md, paddingH: spacing.lg, minHeight: 56 },
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
        {
          backgroundColor: palette.bg,
          borderColor: palette.border ?? 'transparent',
          borderWidth: palette.border ? 1 : 0,
          paddingVertical: sizing.paddingV,
          paddingHorizontal: sizing.paddingH,
          minHeight: sizing.minHeight,
          opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
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
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.button,
  },
});
