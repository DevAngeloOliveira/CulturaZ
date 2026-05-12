import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { spacing } from '@/theme';

import { SelectChip } from './SelectChip';

interface ChipOption {
  value: string;
  label: string;
}

interface SelectChipGroupProps {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
  horizontal?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const SelectChipGroup = ({
  options,
  value,
  onChange,
  horizontal = true,
  containerStyle,
}: SelectChipGroupProps) => {
  const chips = options.map((option) => (
    <SelectChip
      key={option.value}
      label={option.label}
      selected={option.value === value}
      onPress={() => onChange(option.value)}
      style={styles.chip}
    />
  ));

  if (!horizontal) {
    return <View style={[styles.wrap, containerStyle]}>{chips}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      style={containerStyle}
    >
      {chips}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chip: {
    marginRight: spacing.sm,
  },
});
