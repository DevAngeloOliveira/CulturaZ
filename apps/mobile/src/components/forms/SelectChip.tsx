import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

interface SelectChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SelectChip = ({ label, selected, onPress, style }: SelectChipProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.base,
      selected ? styles.selected : styles.idle,
      pressed ? { opacity: 0.85 } : null,
      style,
    ]}
  >
    <Text style={[styles.label, { color: selected ? colors.white : colors.textPrimary }]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  idle: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    ...typography.label,
  },
});
