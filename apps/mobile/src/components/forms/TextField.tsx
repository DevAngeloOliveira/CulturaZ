import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextInputFocusEventData,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helper?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightSlot?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const resolveBorderColor = (hasError: boolean, focused: boolean): string => {
  if (hasError) return colors.error;
  if (focused) return colors.secondary;
  return colors.border;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    { label, helper, error, leftIcon, rightSlot, containerStyle, onFocus, onBlur, ...rest },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const hasError = Boolean(error);
    const helperMessage = error ?? helper;

    const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(event);
    };

    return (
      <View style={[styles.wrap, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View
          style={[
            styles.fieldBox,
            { borderColor: resolveBorderColor(hasError, focused) },
            focused && !hasError ? styles.focusedRing : null,
          ]}
        >
          {leftIcon ? (
            <Ionicons
              name={leftIcon}
              size={18}
              color={colors.textSecondary}
              style={styles.leftIcon}
            />
          ) : null}
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
          {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
        </View>
        {helperMessage ? (
          <Text style={[styles.helper, hasError ? styles.helperError : null]}>
            {helperMessage}
          </Text>
        ) : null}
      </View>
    );
  },
);

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  label: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.xs + 2,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  focusedRing: Platform.select({
    ios: {
      shadowColor: colors.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 5,
    },
    android: { elevation: 2 },
    default: {},
  }) as ViewStyle,
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm + 2,
  },
  rightSlot: {
    marginLeft: spacing.sm,
  },
  helper: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  helperError: {
    color: colors.error,
  },
});
