import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { colors, shadows } from '@/theme';

interface FloatingActionButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  icon: keyof typeof Ionicons.glyphMap;
}

export const FloatingActionButton = ({ icon, ...rest }: FloatingActionButtonProps) => (
  <Pressable
    {...rest}
    style={({ pressed }) => [styles.fab, shadows.md, pressed ? styles.pressed : null]}
  >
    <Ionicons name={icon} size={26} color={colors.white} />
  </Pressable>
);

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 24,
    right: 16,
  },
  pressed: {
    opacity: 0.85,
  },
});
