import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, touchTarget, typography } from '@/theme';

interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  containerStyle?: StyleProp<ViewStyle>;
  background?: string;
}

export const SearchInput = ({
  containerStyle,
  background = colors.surface,
  placeholder = 'Buscar livros, autores, sebos...',
  ...rest
}: SearchInputProps) => (
  <View style={[styles.container, { backgroundColor: background }, containerStyle]}>
    <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      style={styles.input}
      returnKeyType="search"
      {...rest}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    minHeight: touchTarget,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
});
