import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';

import { colors, spacing, typography } from '@/theme';

export const bottomTabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textSecondary,
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    paddingTop: spacing.xs,
    paddingBottom: Platform.OS === 'ios' ? 24 : spacing.sm,
    height: Platform.OS === 'ios' ? 78 : 64,
  },
  tabBarLabelStyle: {
    ...typography.caption,
  },
};

type IoniconName = keyof typeof Ionicons.glyphMap;

export const tabIcon =
  (name: IoniconName) =>
  ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} size={size} color={color} />
  );
