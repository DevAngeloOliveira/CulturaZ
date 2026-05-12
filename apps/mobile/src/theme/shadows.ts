import { Platform, ViewStyle } from 'react-native';

const ios = (radius: number, opacity: number, height: number): ViewStyle => ({
  shadowColor: '#1B1A14',
  shadowOffset: { width: 0, height },
  shadowOpacity: opacity,
  shadowRadius: radius,
});

const android = (elevation: number): ViewStyle => ({ elevation });

export const shadows: Record<'none' | 'sm' | 'md', ViewStyle> = {
  none: {},
  sm: Platform.select({
    ios: ios(8, 0.06, 2),
    android: android(2),
    default: {},
  }) as ViewStyle,
  md: Platform.select({
    ios: ios(16, 0.1, 6),
    android: android(6),
    default: {},
  }) as ViewStyle,
};

export type ShadowToken = keyof typeof shadows;
