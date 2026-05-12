import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { Badge } from '@/components/feedback/Badge';
import { colors, touchTarget } from '@/theme';

interface IconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  badgeCount?: number;
  background?: string;
}

export const IconButton = ({
  icon,
  size = 22,
  color = colors.textPrimary,
  badgeCount,
  background,
  ...rest
}: IconButtonProps) => (
  <Pressable
    {...rest}
    style={({ pressed }) => [
      styles.container,
      background ? { backgroundColor: background } : null,
      pressed ? styles.pressed : null,
    ]}
    hitSlop={8}
  >
    <Ionicons name={icon} size={size} color={color} />
    {badgeCount !== undefined && badgeCount > 0 ? (
      <View style={styles.badgeWrap}>
        <Badge label={badgeCount > 99 ? '99+' : String(badgeCount)} tone="accent" />
      </View>
    ) : null}
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: touchTarget / 2,
  },
  pressed: {
    opacity: 0.7,
  },
  badgeWrap: {
    position: 'absolute',
    top: 4,
    right: 2,
  },
});
