import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, touchTarget, typography } from '@/theme';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helper?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightSlot?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, helper, error, leftIcon, rightSlot, containerStyle, ...rest }, ref) => {
    const hasError = Boolean(error);

    return (
      <View style={[styles.wrap, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View
          style={[
            styles.fieldBox,
            { borderColor: hasError ? colors.error : colors.border },
          ]}
        >
          {leftIcon ? (
            <Ionicons name={leftIcon} size={18} color={colors.textSecondary} style={styles.leftIcon} />
          ) : null}
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            {...rest}
          />
          {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
        </View>
        {error ? (
          <Text style={[styles.helper, { color: colors.error }]}>{error}</Text>
        ) : helper ? (
          <Text style={styles.helper}>{helper}</Text>
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
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    minHeight: touchTarget,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  rightSlot: {
    marginLeft: spacing.sm,
  },
  helper: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
